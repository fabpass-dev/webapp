import { NextResponse } from "next/server";
import { randomBytes } from "crypto";
import { Resend } from "resend";
import { createAdminClient } from "@/lib/supabase/admin";

const REMITENTE = "FabPass <no-reply@mail.thefabpass.com>";

function escaparHtml(texto: string): string {
  return texto.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

export async function POST(request: Request) {
  const body = await request.json();
  const { email, dias_turismo, adultos, menores, ritmo, fecha_inicio, atracciones_ids, pase_recomendado, variante_recomendada, ahorro_estimado } =
    body ?? {};

  if (!email || typeof email !== "string" || !email.includes("@") || !Array.isArray(atracciones_ids)) {
    return NextResponse.json({ ok: false, error: "datos_invalidos" }, { status: 400 });
  }

  const linkToken = randomBytes(16).toString("hex");
  const expiresAt = new Date();
  expiresAt.setMonth(expiresAt.getMonth() + 12);

  const admin = createAdminClient();
  const { error } = await admin.from("itinerarios").insert({
    email: email.trim().toLowerCase(),
    dias_turismo,
    adultos,
    menores,
    ritmo,
    fecha_inicio: fecha_inicio || null,
    atracciones_ids,
    pase_recomendado,
    variante_recomendada,
    ahorro_estimado,
    link_token: linkToken,
    expires_at: expiresAt.toISOString(),
    contenido: {},
  });

  if (error) {
    return NextResponse.json({ ok: false, error: "no_se_pudo_guardar" }, { status: 500 });
  }

  const resendKey = process.env.RESEND_API_KEY;
  if (resendKey) {
    const origin = new URL(request.url).origin;
    const link = `${origin}/es/buenos-aires/planificador?itinerario=${linkToken}`;
    try {
      await new Resend(resendKey).emails.send({
        from: REMITENTE,
        to: email,
        subject: "Tu itinerario de Buenos Aires — FabPass",
        html: `<p>Guardamos tu itinerario. Podés volver a verlo y editarlo con este link, válido por 12 meses:</p>
               <p><a href="${escaparHtml(link)}">${escaparHtml(link)}</a></p>`,
      });
    } catch {
      // El itinerario ya quedó guardado igual; el mail es una comodidad, no bloquea la respuesta.
    }
  }

  return NextResponse.json({ ok: true, link_token: linkToken });
}
