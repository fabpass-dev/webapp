import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";

const TREINTA_DIAS_MS = 30 * 24 * 60 * 60 * 1000;

export async function POST(request: Request) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ ok: false, error: "no_autorizado" }, { status: 401 });
  }

  const { pase_id } = (await request.json()) ?? {};
  if (!pase_id) {
    return NextResponse.json({ ok: false, error: "falta_pase_id" }, { status: 400 });
  }

  // RLS (pases_turista_lee_los_propios) ya garantiza que solo vea su propio pase.
  const { data: pase } = await supabase
    .from("pases")
    .select("id, estado, fecha_activacion, fecha_compra, monto_pagado, transaccion_id")
    .eq("id", pase_id)
    .maybeSingle();

  if (!pase) {
    return NextResponse.json({ ok: false, error: "pase_no_encontrado" }, { status: 404 });
  }

  if (pase.estado === "reembolsado") {
    return NextResponse.json({ ok: false, error: "ya_reembolsado" }, { status: 400 });
  }

  const yaActivado = pase.fecha_activacion !== null;
  const fueraDePlazo = Date.now() - new Date(pase.fecha_compra).getTime() > TREINTA_DIAS_MS;

  if (yaActivado || fueraDePlazo) {
    return NextResponse.json(
      {
        ok: false,
        error: "no_elegible",
        motivo: yaActivado ? "ya_activado" : "fuera_de_plazo",
      },
      { status: 400 },
    );
  }

  const admin = createAdminClient();

  const { error: errorReembolso } = await admin.from("reembolsos").insert({
    pase_id: pase.id,
    transaccion_id: pase.transaccion_id,
    motivo: "Solicitado por el usuario — no activado y dentro de los 30 días de la compra",
    monto_reembolsado: pase.monto_pagado,
  });

  if (errorReembolso) {
    return NextResponse.json({ ok: false, error: "no_se_pudo_procesar" }, { status: 500 });
  }

  await admin.from("pases").update({ estado: "reembolsado" }).eq("id", pase.id);

  // Si con este reembolso ya quedaron todos los pases de la misma compra
  // reembolsados, la transacción completa pasa a "reembolsado".
  const { data: hermanos } = await admin.from("pases").select("estado").eq("transaccion_id", pase.transaccion_id);
  if (hermanos?.every((p) => p.estado === "reembolsado")) {
    await admin.from("transacciones").update({ estado: "reembolsado" }).eq("id", pase.transaccion_id);
  }

  return NextResponse.json({ ok: true });
}
