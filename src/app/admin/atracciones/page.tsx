import Link from "next/link";
import { createAdminClient } from "@/lib/supabase/admin";
import { getAdminUser } from "@/lib/admin/require-admin";
import { PedirMagicLink } from "@/components/PedirMagicLink";
import { NuevaAtraccionForm } from "@/components/admin/NuevaAtraccionForm";
import { ToggleActivoBoton } from "@/components/admin/ToggleActivoBoton";

export default async function AdminAtraccionesPage() {
  const user = await getAdminUser();

  if (!user) {
    return (
      <main className="p-8 max-w-sm mx-auto flex flex-col gap-4">
        <h1 className="text-2xl font-bold">Admin FabPass</h1>
        <PedirMagicLink next="/admin/atracciones" />
      </main>
    );
  }

  const admin = createAdminClient();
  const [{ data: atracciones }, { data: ciudades }] = await Promise.all([
    admin
      .from("atracciones")
      .select("id, nombre, categorias, precio_mayor, comision_pct_default, activa")
      .order("nombre"),
    admin.from("ciudades").select("id, nombre").order("nombre"),
  ]);

  return (
    <main className="p-8 max-w-3xl mx-auto flex flex-col gap-6">
      <Link href="/admin" className="text-sm underline">
        ← Volver
      </Link>
      <h1 className="text-2xl font-bold">Atracciones ({atracciones?.length ?? 0})</h1>

      <NuevaAtraccionForm ciudades={ciudades ?? []} />

      <table className="w-full text-sm border-collapse">
        <thead>
          <tr className="text-left border-b">
            <th className="py-1">Nombre</th>
            <th>Categoría</th>
            <th>Precio USD</th>
            <th>% Comisión</th>
            <th>Visible en la web</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {atracciones?.map((a) => (
            <tr key={a.id} className="border-b">
              <td className="py-1">{a.nombre}</td>
              <td>{(a.categorias as string[] | null)?.join(", ")}</td>
              <td>{a.precio_mayor}</td>
              <td>{a.comision_pct_default}%</td>
              <td>{a.activa ? "Sí" : "No"}</td>
              <td>
                <ToggleActivoBoton endpoint={`/api/admin/atracciones/${a.id}/toggle`} activo={a.activa} />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </main>
  );
}
