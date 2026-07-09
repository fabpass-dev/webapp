import { NextResponse } from "next/server";
import { createClient as createPublicClient } from "@supabase/supabase-js";
import { createAdminClient } from "@/lib/supabase/admin";
import { generarCodigoAlfanumerico } from "@/lib/checkout/codigo-alfanumerico";

type Titular = { nombre: string; apellido: string; es_menor: boolean };

type CheckoutBody = {
  producto_id: string;
  gateway: "mercadopago" | "stripe";
  email: string;
  cupon_codigo?: string;
  titulares: Titular[];
};

function fechaLimiteActivacion(): string {
  const fecha = new Date();
  fecha.setFullYear(fecha.getFullYear() + 1);
  return fecha.toISOString();
}

export async function POST(request: Request) {
  const body = (await request.json()) as Partial<CheckoutBody>;

  if (!body.producto_id || !body.email || !body.gateway) {
    return NextResponse.json({ ok: false, error: "faltan_datos" }, { status: 400 });
  }
  if (!/^\S+@\S+\.\S+$/.test(body.email)) {
    return NextResponse.json({ ok: false, error: "email_invalido" }, { status: 400 });
  }
  if (!Array.isArray(body.titulares) || body.titulares.length === 0) {
    return NextResponse.json({ ok: false, error: "faltan_titulares" }, { status: 400 });
  }
  for (const t of body.titulares) {
    if (!t.nombre?.trim() || !t.apellido?.trim()) {
      return NextResponse.json({ ok: false, error: "titular_incompleto" }, { status: 400 });
    }
  }

  const admin = createAdminClient();

  const { data: producto, error: errorProducto } = await admin
    .from("productos")
    .select("*")
    .eq("id", body.producto_id)
    .eq("activo", true)
    .single();

  if (errorProducto || !producto) {
    return NextResponse.json({ ok: false, error: "producto_no_encontrado" }, { status: 404 });
  }

  const montoBrutoPorTitular = body.titulares.map((t) =>
    t.es_menor ? Number(producto.precio_menor_usd ?? producto.precio_usd) : Number(producto.precio_usd),
  );
  const montoBruto = montoBrutoPorTitular.reduce((a, b) => a + b, 0);

  let montoNeto = montoBruto;
  let cuponId: string | null = null;
  let cuponUsosActuales = 0;

  if (body.cupon_codigo) {
    const codigo = body.cupon_codigo.trim().toUpperCase();
    const { data: cupon } = await admin
      .from("cupones")
      .select("*")
      .eq("codigo", codigo)
      .eq("activo", true)
      .single();

    const ahora = new Date();
    const vigente =
      cupon &&
      new Date(cupon.vigente_desde) <= ahora &&
      ahora <= new Date(cupon.vigente_hasta) &&
      (cupon.limite_usos === null || cupon.usos_actuales < cupon.limite_usos);

    if (!vigente) {
      return NextResponse.json({ ok: false, error: "cupon_invalido" }, { status: 400 });
    }

    cuponId = cupon.id;
    cuponUsosActuales = cupon.usos_actuales;
    montoNeto =
      cupon.tipo_descuento === "porcentaje"
        ? montoBruto * (1 - Number(cupon.valor) / 100)
        : Math.max(0, montoBruto - Number(cupon.valor));
  }

  // Checkout de invitado: si el email ya tiene cuenta, la reusamos; si no, se
  // crea una cuenta nueva sin contraseña (el trigger on_auth_user_created ya
  // copia el registro a public.usuarios).
  const { data: usuarioExistente } = await admin
    .from("usuarios")
    .select("id")
    .eq("email", body.email)
    .maybeSingle();

  let usuarioId = usuarioExistente?.id as string | undefined;

  if (!usuarioId) {
    const { data: nuevoUsuario, error: errorCrearUsuario } = await admin.auth.admin.createUser({
      email: body.email,
      email_confirm: true,
    });
    if (errorCrearUsuario || !nuevoUsuario.user) {
      return NextResponse.json({ ok: false, error: "no_se_pudo_crear_cuenta" }, { status: 500 });
    }
    usuarioId = nuevoUsuario.user.id;
  }

  const { data: transaccion, error: errorTransaccion } = await admin
    .from("transacciones")
    .insert({
      gateway: body.gateway,
      modo_transaccion: "simulado",
      monto: montoNeto,
      moneda: "USD",
      estado: "aprobado",
    })
    .select()
    .single();

  if (errorTransaccion || !transaccion) {
    return NextResponse.json({ ok: false, error: "no_se_pudo_crear_transaccion" }, { status: 500 });
  }

  const factorDescuento = montoBruto > 0 ? montoNeto / montoBruto : 1;
  const nuevosPases = body.titulares.map((t, i) => ({
    usuario_id: usuarioId,
    producto_id: producto.id,
    codigo_alfanumerico: generarCodigoAlfanumerico(),
    fecha_limite_activacion: fechaLimiteActivacion(),
    titular_nombre: t.nombre.trim(),
    titular_apellido: t.apellido.trim(),
    es_menor: t.es_menor,
    monto_pagado: Math.round(montoBrutoPorTitular[i] * factorDescuento * 100) / 100,
    transaccion_id: transaccion.id,
  }));

  const { data: pases, error: errorPases } = await admin
    .from("pases")
    .insert(nuevosPases)
    .select("id, codigo_alfanumerico, titular_nombre, titular_apellido");

  if (errorPases || !pases) {
    return NextResponse.json({ ok: false, error: "no_se_pudieron_crear_pases" }, { status: 500 });
  }

  if (cuponId) {
    await admin.from("cupones").update({ usos_actuales: cuponUsosActuales + 1 }).eq("id", cuponId);
  }

  // Dispara el magic link para que pueda entrar a "Mi FabPass" sin contraseña.
  const publico = createPublicClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!,
    { auth: { flowType: "pkce" } },
  );
  const origin = new URL(request.url).origin;
  await publico.auth.signInWithOtp({
    email: body.email,
    options: { emailRedirectTo: `${origin}/auth/callback` },
  });

  return NextResponse.json({
    ok: true,
    transaccion_id: transaccion.id,
    pases,
  });
}
