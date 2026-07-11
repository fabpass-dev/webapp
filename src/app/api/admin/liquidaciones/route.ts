import { NextResponse } from "next/server";
import { getAdminUser } from "@/lib/admin/require-admin";
import { createAdminClient } from "@/lib/supabase/admin";

export async function POST(request: Request) {
  const user = await getAdminUser();
  if (!user) {
    return NextResponse.json({ ok: false, error: "no_autorizado" }, { status: 401 });
  }

  const { partner_id } = (await request.json()) ?? {};
  if (!partner_id) {
    return NextResponse.json({ ok: false, error: "falta_partner_id" }, { status: 400 });
  }

  const admin = createAdminClient();

  const { data: ultima } = await admin
    .from("liquidaciones")
    .select("periodo_hasta")
    .eq("partner_id", partner_id)
    .order("periodo_hasta", { ascending: false })
    .limit(1)
    .maybeSingle();

  const periodoDesde = ultima?.periodo_hasta ?? "2020-01-01";
  const periodoHasta = new Date().toISOString();

  const { data: atracciones } = await admin.from("atracciones").select("id").eq("partner_id", partner_id);
  const atraccionIds = (atracciones ?? []).map((a) => a.id);

  if (atraccionIds.length === 0) {
    return NextResponse.json({ ok: false, error: "sin_atracciones" }, { status: 400 });
  }

  const { data: usos } = await admin
    .from("usos")
    .select("monto_a_liquidar")
    .in("atraccion_id", atraccionIds)
    .eq("estado", "valido")
    .gt("fecha_hora", periodoDesde)
    .lte("fecha_hora", periodoHasta);

  const montoTotal = (usos ?? []).reduce((acc, u) => acc + Number(u.monto_a_liquidar), 0);

  if (!usos || usos.length === 0) {
    return NextResponse.json({ ok: false, error: "nada_pendiente" }, { status: 400 });
  }

  const { error } = await admin.from("liquidaciones").insert({
    partner_id,
    periodo_desde: periodoDesde,
    periodo_hasta: periodoHasta,
    monto_total: Math.round(montoTotal * 100) / 100,
    pagado: false,
  });

  if (error) {
    return NextResponse.json({ ok: false, error: "no_se_pudo_crear" }, { status: 500 });
  }

  return NextResponse.json({ ok: true, monto_total: montoTotal, cantidad_usos: usos.length });
}
