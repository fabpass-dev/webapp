"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

const MOTIVOS: Record<string, string> = {
  ya_activado: "Este pase ya fue activado — no corresponde reembolso automático.",
  fuera_de_plazo: "Pasaron más de 30 días desde la compra — no corresponde reembolso automático.",
  ya_reembolsado: "Este pase ya estaba reembolsado.",
};

export function SolicitarReembolsoBoton({ paseId }: { paseId: string }) {
  const router = useRouter();
  const [enviando, setEnviando] = useState(false);
  const [resultado, setResultado] = useState<string | null>(null);

  async function solicitar() {
    setEnviando(true);
    setResultado(null);
    const res = await fetch("/api/reembolsos", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ pase_id: paseId }),
    });
    const data = await res.json();
    if (data.ok) {
      setResultado("✓ Reembolso aprobado.");
      router.refresh();
    } else {
      setResultado(MOTIVOS[data.motivo] ?? MOTIVOS[data.error] ?? "No se pudo procesar el reembolso.");
    }
    setEnviando(false);
  }

  return (
    <div className="flex flex-col gap-1">
      <button className="text-sm underline self-start" onClick={solicitar} disabled={enviando}>
        {enviando ? "Procesando..." : "Solicitar reembolso"}
      </button>
      {resultado && <p className="text-xs text-gray-600">{resultado}</p>}
    </div>
  );
}
