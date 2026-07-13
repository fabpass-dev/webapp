import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";

export async function POST(request: Request) {
  const { email, source } = (await request.json()) ?? {};

  if (!email || typeof email !== "string" || !email.includes("@") || !source) {
    return NextResponse.json({ ok: false, error: "datos_invalidos" }, { status: 400 });
  }

  const admin = createAdminClient();

  const { data: existente } = await admin
    .from("leads")
    .select("id")
    .eq("email", email.trim().toLowerCase())
    .eq("source", source)
    .maybeSingle();

  if (existente) {
    return NextResponse.json({ ok: true, yaExistia: true });
  }

  const { error } = await admin.from("leads").insert({ email: email.trim().toLowerCase(), source });

  if (error) {
    return NextResponse.json({ ok: false, error: "no_se_pudo_guardar" }, { status: 500 });
  }

  return NextResponse.json({ ok: true, yaExistia: false });
}
