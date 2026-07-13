import { NextResponse } from "next/server";
import { getAdminUser } from "@/lib/admin/require-admin";
import { createAdminClient } from "@/lib/supabase/admin";

export async function POST(request: Request) {
  const user = await getAdminUser();
  if (!user) {
    return NextResponse.json({ ok: false, error: "no_autorizado" }, { status: 401 });
  }

  const body = await request.json();
  const { nombre, slug, pais, moneda } = body ?? {};

  if (!nombre || !slug || !pais || !moneda) {
    return NextResponse.json({ ok: false, error: "datos_invalidos" }, { status: 400 });
  }

  const admin = createAdminClient();
  const { error } = await admin.from("ciudades").insert({
    nombre: String(nombre).trim(),
    slug: String(slug).trim().toLowerCase(),
    pais: String(pais).trim(),
    moneda: String(moneda).trim().toUpperCase(),
    activa: true,
  });

  if (error) {
    return NextResponse.json({ ok: false, error: "no_se_pudo_crear" }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}
