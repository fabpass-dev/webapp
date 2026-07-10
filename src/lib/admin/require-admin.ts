import { createClient } from "@/lib/supabase/server";

// Chequeo compartido entre páginas (Server Components) y rutas API: primero
// confirma que hay una sesión, después que esa persona está en `admins`. Las
// escrituras reales igual pasan por el cliente con la clave secreta — esto
// solo decide si se lo dejamos intentar.
export async function getAdminUser() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return null;

  const { data: admin } = await supabase.from("admins").select("user_id").eq("user_id", user.id).maybeSingle();

  return admin ? user : null;
}
