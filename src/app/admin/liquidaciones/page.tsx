import Link from "next/link";
import { createAdminClient } from "@/lib/supabase/admin";
import { getAdminUser } from "@/lib/admin/require-admin";
import { PedirMagicLink } from "@/components/PedirMagicLink";
import { GenerarLiquidacionForm } from "@/components/admin/GenerarLiquidacionForm";
import { MarcarPagadaBoton } from "@/components/admin/MarcarPagadaBoton";

export default async function AdminLiquidacionesPage() {
  const user = await getAdminUser();

  if (!user) {
    return (
      <main className="p-8 max-w-sm mx-auto flex flex-col gap-4">
        <h1 className="text-2xl font-bold">Admin FabPass</h1>
        <PedirMagicLink next="/admin/liquidaciones" />
      </main>
    );
  }

  const admin = createAdminClient();
  const [{ data: partners }, { data: liquidaciones }] = await Promise.all([
    admin.from("partners").select("id, nombre").eq("activo", true).order("nombre"),
    admin
      .from("liquidaciones")
      .select("id, partner_id, periodo_desde, periodo_hasta, monto_total, pagado, fecha_pago, partners(nombre)")
      .order("periodo_hasta", { ascending: false }),
  ]);

  return (
    <main className="p-8 max-w-3xl mx-auto flex flex-col gap-6">
      <Link href="/admin" className="text-sm underline">
        ← Volver
      </Link>
      <h1 className="text-2xl font-bold">Liquidaciones</h1>
      <p className="text-sm text-gray-500">
        Solo liquidaciones a partners/atracciones por usos (no incluye todavía la comisión de venta de empleados).
      </p>

      <GenerarLiquidacionForm partners={partners ?? []} />

      <table className="w-full text-sm border-collapse">
        <thead>
          <tr className="text-left border-b">
            <th className="py-1">Partner</th>
            <th>Período</th>
            <th>Monto</th>
            <th>Estado</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {liquidaciones?.map((l) => (
            <tr key={l.id} className="border-b">
              <td className="py-1">{(l.partners as unknown as { nombre: string } | null)?.nombre}</td>
              <td>
                {l.periodo_desde} → {l.periodo_hasta}
              </td>
              <td>USD {Number(l.monto_total).toFixed(2)}</td>
              <td>{l.pagado ? `Pagada (${l.fecha_pago?.slice(0, 10)})` : "Pendiente"}</td>
              <td>{!l.pagado && <MarcarPagadaBoton id={l.id} />}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </main>
  );
}
