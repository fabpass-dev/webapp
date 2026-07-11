import { createClient } from "@/lib/supabase/client";

// Tiene que llamarse siempre desde el navegador (nunca desde el servidor):
// el flujo PKCE guarda un "verificador" en este mismo navegador, que después
// se necesita para completar el login cuando la persona toca el link del mail.
export async function enviarMagicLink(email: string, next?: string): Promise<string | null> {
  const callback = `${window.location.origin}/auth/callback`;
  const { error } = await createClient().auth.signInWithOtp({
    email,
    options: { emailRedirectTo: next ? `${callback}?next=${encodeURIComponent(next)}` : callback },
  });
  return error ? error.message : null;
}
