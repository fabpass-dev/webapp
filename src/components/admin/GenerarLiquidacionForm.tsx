"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

type Partner = { id: string; nombre: string };

export function GenerarLiquidacionForm({ partners }: { partners: Partner[] }) {
  const router = useRouter();
  const [partnerId, setPartnerId] = useState(partners[0]?.id ?? "");
  const [enviando, setEnviando] = useState(false);
  const [mensaje, setMensaje] = useState<string | null>(null);

  async function generar() {
    setEnviando(true);
    setMensaje(null);
    const res = await fetch("/api/admin/liquidaciones", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ partner_id: partnerId }),
    });
    const data = await res.json();
    if (data.ok) {
      setMensaje(`Liquidación generada: USD ${data.monto_total.toFixed(2)} (${data.cantidad_usos} usos).`);
      router.refresh();
    } else if (data.error === "nada_pendiente") {
      setMensaje("No hay usos pendientes de liquidar para este partner.");
    } else {
      setMensaje("Error: " + data.error);
    }
    setEnviando(false);
  }

  return (
    <div className="border rounded p-4 flex flex-col gap-2 max-w-sm">
      <h2 className="font-semibold">Generar liquidación</h2>
      <select className="border rounded px-2 py-1" value={partnerId} onChange={(e) => setPartnerId(e.target.value)}>
        {partners.map((p) => (
          <option key={p.id} value={p.id}>
            {p.nombre}
          </option>
        ))}
      </select>
      <button
        className="rounded bg-black text-white px-4 py-2 disabled:opacity-50"
        onClick={generar}
        disabled={enviando || !partnerId}
      >
        {enviando ? "Calculando..." : "Generar liquidación pendiente"}
      </button>
      {mensaje && <p className="text-sm text-gray-600">{mensaje}</p>}
    </div>
  );
}
