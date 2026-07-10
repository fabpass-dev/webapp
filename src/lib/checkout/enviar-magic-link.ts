import { createClient } from "@/lib/supabase/client";

// Tiene que llamarse siempre desde el navegador (nunca desde el servidor):
// el flujo PKCE guarda un "verificador" en este mismo navegador, que después
// se necesita para completar el login cuando la persona toca el link del mail.
export async function enviarMagicLink(email: string, next?: string) {
  const callback = `${window.location.origin}/auth/callback`;
  await createClient().auth.signInWithOtp({
    email,
    options: { emailRedirectTo: next ? `${callback}?next=${encodeURIComponent(next)}` : callback },
  });
}
