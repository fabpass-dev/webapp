import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { ValidarQrForm } from "@/components/ValidarQrForm";

export default async function ValidarPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return (
      <main className="p-8 max-w-sm mx-auto flex flex-col gap-4">
        <h1 className="text-2xl font-bold">Validación QR</h1>
        <p>
          Necesitás loguearte primero.{" "}
          <Link className="underline" href="/partners/auth">
            Ir al login
          </Link>
          .
        </p>
      </main>
    );
  }

  const { data: empleado } = await supabase
    .from("empleados")
    .select("id, partner_id, activo")
    .eq("auth_user_id", user.id)
    .maybeSingle();

  if (!empleado || !empleado.activo) {
    return (
      <main className="p-8 max-w-sm mx-auto flex flex-col gap-4">
        <h1 className="text-2xl font-bold">Validación QR</h1>
        <p>Tu usuario no está habilitado como empleado activo de ninguna atracción.</p>
      </main>
    );
  }

  const { data: atracciones } = await supabase
    .from("atracciones")
    .select("id, nombre")
    .eq("partner_id", empleado.partner_id)
    .eq("activa", true);

  if (!atracciones || atracciones.length === 0) {
    return (
      <main className="p-8 max-w-sm mx-auto flex flex-col gap-4">
        <h1 className="text-2xl font-bold">Validación QR</h1>
        <p>Tu partner todavía no tiene ninguna atracción activa vinculada.</p>
      </main>
    );
  }

  return (
    <main className="p-8 max-w-sm mx-auto flex flex-col gap-4">
      <h1 className="text-2xl font-bold">Validación QR</h1>
      <ValidarQrForm atracciones={atracciones} />
    </main>
  );
}
