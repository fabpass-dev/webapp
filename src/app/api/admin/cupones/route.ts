import { NextResponse } from "next/server";
import { getAdminUser } from "@/lib/admin/require-admin";
import { createAdminClient } from "@/lib/supabase/admin";

export async function POST(request: Request) {
  const user = await getAdminUser();
  if (!user) {
    return NextResponse.json({ ok: false, error: "no_autorizado" }, { status: 401 });
  }

  const body = await request.json();
  const { codigo, tipo_descuento, valor, vigente_hasta, limite_usos } = body ?? {};

  if (
    !codigo ||
    !["porcentaje", "monto_fijo"].includes(tipo_descuento) ||
    typeof valor !== "number" ||
    valor < 0 ||
    !vigente_hasta
  ) {
    return NextResponse.json({ ok: false, error: "datos_invalidos" }, { status: 400 });
  }

  const admin = createAdminClient();
  const { error } = await admin.from("cupones").insert({
    codigo: String(codigo).trim().toUpperCase(),
    tipo_descuento,
    valor,
    vigente_desde: new Date().toISOString(),
    vigente_hasta: new Date(vigente_hasta).toISOString(),
    limite_usos: limite_usos ?? null,
    usos_actuales: 0,
    activo: true,
  });

  if (error) {
    const duplicado = error.code === "23505";
    return NextResponse.json(
      { ok: false, error: duplicado ? "codigo_ya_existe" : "no_se_pudo_crear" },
      { status: duplicado ? 409 : 500 },
    );
  }

  return NextResponse.json({ ok: true });
}
