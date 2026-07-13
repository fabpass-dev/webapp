import { NextResponse } from "next/server";
import { getAdminUser } from "@/lib/admin/require-admin";
import { createAdminClient } from "@/lib/supabase/admin";

export async function POST(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  const user = await getAdminUser();
  if (!user) {
    return NextResponse.json({ ok: false, error: "no_autorizado" }, { status: 401 });
  }

  const { id } = await params;
  const admin = createAdminClient();
  const { data: actual, error: errorLectura } = await admin.from("productos").select("activo").eq("id", id).single();
  if (errorLectura || !actual) {
    return NextResponse.json({ ok: false, error: "no_encontrado" }, { status: 404 });
  }

  const { error } = await admin.from("productos").update({ activo: !actual.activo }).eq("id", id);
  if (error) {
    return NextResponse.json({ ok: false, error: "no_se_pudo_actualizar" }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}
