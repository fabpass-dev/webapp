import { NextResponse } from "next/server";
import { getAdminUser } from "@/lib/admin/require-admin";
import { createAdminClient } from "@/lib/supabase/admin";

export async function POST(request: Request) {
  const user = await getAdminUser();
  if (!user) {
    return NextResponse.json({ ok: false, error: "no_autorizado" }, { status: 401 });
  }

  const body = await request.json();
  const { nombre, categoria, ciudad_id, precio_mayor, comision_pct_default } = body ?? {};

  if (!nombre || !ciudad_id || typeof precio_mayor !== "number" || precio_mayor < 0) {
    return NextResponse.json({ ok: false, error: "datos_invalidos" }, { status: 400 });
  }

  const admin = createAdminClient();
  const { error } = await admin.from("atracciones").insert({
    nombre: String(nombre).trim(),
    categoria: categoria ? String(categoria).trim() : null,
    ciudad_id,
    precio_mayor,
    comision_pct_default: typeof comision_pct_default === "number" ? comision_pct_default : 0,
    comision_tipo: "porcentaje",
    activa: true,
  });

  if (error) {
    return NextResponse.json({ ok: false, error: "no_se_pudo_crear" }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}
