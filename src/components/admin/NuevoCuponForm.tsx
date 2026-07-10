"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export function NuevoCuponForm() {
  const router = useRouter();
  const [codigo, setCodigo] = useState("");
  const [tipoDescuento, setTipoDescuento] = useState<"porcentaje" | "monto_fijo">("porcentaje");
  const [valor, setValor] = useState("");
  const [vigenteHasta, setVigenteHasta] = useState("");
  const [limiteUsos, setLimiteUsos] = useState("");
  const [enviando, setEnviando] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function crear() {
    setEnviando(true);
    setError(null);
    const res = await fetch("/api/admin/cupones", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        codigo,
        tipo_descuento: tipoDescuento,
        valor: Number(valor),
        vigente_hasta: vigenteHasta,
        limite_usos: limiteUsos ? Number(limiteUsos) : null,
      }),
    });
    const data = await res.json();
    if (!data.ok) {
      setError(data.error ?? "error_desconocido");
      setEnviando(false);
      return;
    }
    setCodigo("");
    setValor("");
    setVigenteHasta("");
    setLimiteUsos("");
    setEnviando(false);
    router.refresh();
  }

  return (
    <div className="border rounded p-4 flex flex-col gap-2 max-w-sm">
      <h2 className="font-semibold">Nuevo cupón</h2>
      <input
        className="border rounded px-2 py-1"
        placeholder="Código (ej: VERANO2026)"
        value={codigo}
        onChange={(e) => setCodigo(e.target.value.toUpperCase())}
      />
      <select
        className="border rounded px-2 py-1"
        value={tipoDescuento}
        onChange={(e) => setTipoDescuento(e.target.value as "porcentaje" | "monto_fijo")}
      >
        <option value="porcentaje">% de descuento</option>
        <option value="monto_fijo">Monto fijo (USD)</option>
      </select>
      <input
        className="border rounded px-2 py-1"
        placeholder={tipoDescuento === "porcentaje" ? "Valor (ej: 10 = 10%)" : "Valor en USD"}
        type="number"
        value={valor}
        onChange={(e) => setValor(e.target.value)}
      />
      <label className="text-xs text-gray-500">Vigente hasta</label>
      <input
        className="border rounded px-2 py-1"
        type="date"
        value={vigenteHasta}
        onChange={(e) => setVigenteHasta(e.target.value)}
      />
      <input
        className="border rounded px-2 py-1"
        placeholder="Límite de usos (opcional)"
        type="number"
        value={limiteUsos}
        onChange={(e) => setLimiteUsos(e.target.value)}
      />
      {error && <p className="text-red-600 text-sm">Error: {error}</p>}
      <button
        className="rounded bg-black text-white px-4 py-2 disabled:opacity-50"
        onClick={crear}
        disabled={enviando || !codigo || !valor || !vigenteHasta}
      >
        {enviando ? "Creando..." : "Crear"}
      </button>
    </div>
  );
}
