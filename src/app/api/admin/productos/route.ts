import { NextResponse } from "next/server";
import { getAdminUser } from "@/lib/admin/require-admin";
import { createAdminClient } from "@/lib/supabase/admin";

const TIPOS_VALIDOS = ["fabdays", "fabflex", "fabblack", "fablife"];

export async function POST(request: Request) {
  const user = await getAdminUser();
  if (!user) {
    return NextResponse.json({ ok: false, error: "no_autorizado" }, { status: 401 });
  }

  const body = await request.json();
  const { ciudad_id, tipo, nombre, variante, precio_usd, validez_dias } = body ?? {};

  if (
    !ciudad_id ||
    !TIPOS_VALIDOS.includes(tipo) ||
    !nombre ||
    !variante ||
    typeof precio_usd !== "number" ||
    precio_usd < 0 ||
    typeof validez_dias !== "number" ||
    validez_dias <= 0
  ) {
    return NextResponse.json({ ok: false, error: "datos_invalidos" }, { status: 400 });
  }

  const admin = createAdminClient();
  const { error } = await admin.from("productos").insert({
    ciudad_id,
    tipo,
    nombre: String(nombre).trim(),
    variante: String(variante).trim(),
    precio_usd,
    validez_dias,
    activo: true,
  });

  if (error) {
    return NextResponse.json({ ok: false, error: "no_se_pudo_crear" }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}
