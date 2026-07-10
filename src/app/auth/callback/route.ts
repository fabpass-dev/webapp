import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

// A donde vuelve el navegador después de tocar el magic link del email.
export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");

  if (code) {
    const supabase = await createClient();
    await supabase.auth.exchangeCodeForSession(code);
  }

  // Solo se permite un destino relativo propio (nunca una URL externa), para
  // no convertir esto en un open redirect.
  const next = searchParams.get("next");
  const destino = next && next.startsWith("/") && !next.startsWith("//") ? next : "/es/pass";

  return NextResponse.redirect(`${origin}${destino}`);
}
