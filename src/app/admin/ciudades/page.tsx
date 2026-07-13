import Link from "next/link";
import { createAdminClient } from "@/lib/supabase/admin";
import { getAdminUser } from "@/lib/admin/require-admin";
import { PedirMagicLink } from "@/components/PedirMagicLink";
import { NuevaCiudadForm } from "@/components/admin/NuevaCiudadForm";
import { ToggleActivoBoton } from "@/components/admin/ToggleActivoBoton";

export default async function AdminCiudadesPage() {
  const user = await getAdminUser();

  if (!user) {
    return (
      <main className="p-8 max-w-sm mx-auto flex flex-col gap-4">
        <h1 className="text-2xl font-bold">Admin FabPass</h1>
        <PedirMagicLink next="/admin/ciudades" />
      </main>
    );
  }

  const admin = createAdminClient();
  const { data: ciudades } = await admin.from("ciudades").select("id, nombre, pais, moneda, activa").order("nombre");

  return (
    <main className="p-8 max-w-3xl mx-auto flex flex-col gap-6">
      <Link href="/admin" className="text-sm underline">
        ← Volver
      </Link>
      <h1 className="text-2xl font-bold">Ciudades ({ciudades?.length ?? 0})</h1>

      <NuevaCiudadForm />

      <table className="w-full text-sm border-collapse">
        <thead>
          <tr className="text-left border-b">
            <th className="py-1">Nombre</th>
            <th>País</th>
            <th>Moneda</th>
            <th>Visible en la web</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {ciudades?.map((c) => (
            <tr key={c.id} className="border-b">
              <td className="py-1">{c.nombre}</td>
              <td>{c.pais}</td>
              <td>{c.moneda}</td>
              <td>{c.activa ? "Sí" : "No"}</td>
              <td>
                <ToggleActivoBoton endpoint={`/api/admin/ciudades/${c.id}/toggle`} activo={c.activa} />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </main>
  );
}
