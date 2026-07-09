import { createClient } from "@supabase/supabase-js";

// Cliente con la clave secreta: bypassa RLS por completo. Nunca importar este
// archivo desde código que corra en el navegador — solo desde Route Handlers
// u otro código server-only (Server Components no alcanza: hay que evitar que
// termine en un bundle de cliente).
export function createAdminClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SECRET_KEY!,
    { auth: { autoRefreshToken: false, persistSession: false } },
  );
}
