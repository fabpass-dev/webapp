import Link from "next/link";
import { createAdminClient } from "@/lib/supabase/admin";
import { getAdminUser } from "@/lib/admin/require-admin";
import { PedirMagicLink } from "@/components/PedirMagicLink";
import { NuevoProductoForm } from "@/components/admin/NuevoProductoForm";
import { ToggleActivoBoton } from "@/components/admin/ToggleActivoBoton";

export default async function AdminProductosPage() {
  const user = await getAdminUser();

  if (!user) {
    return (
      <main className="p-8 max-w-sm mx-auto flex flex-col gap-4">
        <h1 className="text-2xl font-bold">Admin FabPass</h1>
        <PedirMagicLink next="/admin/productos" />
      </main>
    );
  }

  const admin = createAdminClient();
  const [{ data: productos }, { data: ciudades }] = await Promise.all([
    admin
      .from("productos")
      .select("id, nombre, variante, tipo, precio_usd, validez_dias, activo, ciudades(nombre)")
      .order("nombre"),
    admin.from("ciudades").select("id, nombre").order("nombre"),
  ]);

  return (
    <main className="p-8 max-w-3xl mx-auto flex flex-col gap-6">
      <Link href="/admin" className="text-sm underline">
        ← Volver
      </Link>
      <h1 className="text-2xl font-bold">Productos ({productos?.length ?? 0})</h1>

      <NuevoProductoForm ciudades={ciudades ?? []} />

      <table className="w-full text-sm border-collapse">
        <thead>
          <tr className="text-left border-b">
            <th className="py-1">Nombre</th>
            <th>Ciudad</th>
            <th>Tipo</th>
            <th>Precio USD</th>
            <th>Validez</th>
            <th>Visible en la web</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {productos?.map((p) => (
            <tr key={p.id} className="border-b">
              <td className="py-1">
                {p.nombre} — {p.variante}
              </td>
              <td>{(p.ciudades as unknown as { nombre: string } | null)?.nombre}</td>
              <td>{p.tipo}</td>
              <td>{p.precio_usd}</td>
              <td>{p.validez_dias}d</td>
              <td>{p.activo ? "Sí" : "No"}</td>
              <td>
                <ToggleActivoBoton endpoint={`/api/admin/productos/${p.id}/toggle`} activo={p.activo} />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </main>
  );
}
