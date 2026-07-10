import Link from "next/link";
import { createAdminClient } from "@/lib/supabase/admin";
import { getAdminUser } from "@/lib/admin/require-admin";
import { PedirMagicLink } from "@/components/PedirMagicLink";
import { NuevoCuponForm } from "@/components/admin/NuevoCuponForm";

export default async function AdminCuponesPage() {
  const user = await getAdminUser();

  if (!user) {
    return (
      <main className="p-8 max-w-sm mx-auto flex flex-col gap-4">
        <h1 className="text-2xl font-bold">Admin FabPass</h1>
        <PedirMagicLink next="/admin/cupones" />
      </main>
    );
  }

  const admin = createAdminClient();
  const { data: cupones } = await admin
    .from("cupones")
    .select("id, codigo, tipo_descuento, valor, vigente_hasta, limite_usos, usos_actuales, activo")
    .order("vigente_hasta", { ascending: false });

  return (
    <main className="p-8 max-w-3xl mx-auto flex flex-col gap-6">
      <Link href="/admin" className="text-sm underline">
        ← Volver
      </Link>
      <h1 className="text-2xl font-bold">Cupones ({cupones?.length ?? 0})</h1>

      <NuevoCuponForm />

      <table className="w-full text-sm border-collapse">
        <thead>
          <tr className="text-left border-b">
            <th className="py-1">Código</th>
            <th>Descuento</th>
            <th>Vigente hasta</th>
            <th>Usos</th>
            <th>Activo</th>
          </tr>
        </thead>
        <tbody>
          {cupones?.map((c) => (
            <tr key={c.id} className="border-b">
              <td className="py-1">{c.codigo}</td>
              <td>{c.tipo_descuento === "porcentaje" ? `${c.valor}%` : `USD ${c.valor}`}</td>
              <td>{c.vigente_hasta ? new Date(c.vigente_hasta).toLocaleDateString("es-AR") : ""}</td>
              <td>
                {c.usos_actuales}
                {c.limite_usos ? ` / ${c.limite_usos}` : ""}
              </td>
              <td>{c.activo ? "Sí" : "No"}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </main>
  );
}
