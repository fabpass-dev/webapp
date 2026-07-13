import Link from "next/link";
import { createClient } from "@/lib/supabase/server";

export default async function AgentsPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return (
      <main className="p-8 max-w-sm mx-auto flex flex-col gap-4">
        <h1 className="text-2xl font-bold">Agents</h1>
        <p>
          Necesitás loguearte primero.{" "}
          <Link className="underline" href="/agents/auth">
            Ir al login
          </Link>
          .
        </p>
      </main>
    );
  }

  const { data: empleado } = await supabase
    .from("empleados")
    .select("id, nombre, activo, partners(nombre, tipo, codigo_partner)")
    .eq("auth_user_id", user.id)
    .maybeSingle();

  if (!empleado || !empleado.activo) {
    return (
      <main className="p-8 max-w-sm mx-auto flex flex-col gap-4">
        <h1 className="text-2xl font-bold">Agents</h1>
        <p>Tu usuario no está habilitado como empleado activo de ningún agent.</p>
      </main>
    );
  }

  const partner = empleado.partners as unknown as { nombre: string; tipo: string; codigo_partner: string } | null;

  return (
    <main className="p-8 max-w-sm mx-auto flex flex-col gap-4">
      <h1 className="text-2xl font-bold">Hola, {empleado.nombre}</h1>
      <p className="text-sm text-gray-500">
        {partner?.nombre} · código {partner?.codigo_partner}
      </p>
      <p className="text-sm text-gray-500">El panel de ventas y comisiones todavía se está construyendo.</p>
    </main>
  );
}
