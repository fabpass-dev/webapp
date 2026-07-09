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

  return NextResponse.redirect(`${origin}/es/pass`);
}
