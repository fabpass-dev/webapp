"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

type Ciudad = { id: string; nombre: string };

const TIPOS = ["fabdays", "fabflex", "fabblack", "fablife"] as const;

export function NuevoProductoForm({ ciudades }: { ciudades: Ciudad[] }) {
  const router = useRouter();
  const [ciudadId, setCiudadId] = useState(ciudades[0]?.id ?? "");
  const [tipo, setTipo] = useState<(typeof TIPOS)[number]>("fabdays");
  const [nombre, setNombre] = useState("");
  const [variante, setVariante] = useState("");
  const [precioUsd, setPrecioUsd] = useState("");
  const [validezDias, setValidezDias] = useState("");
  const [enviando, setEnviando] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function crear() {
    setEnviando(true);
    setError(null);
    const res = await fetch("/api/admin/productos", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        ciudad_id: ciudadId,
        tipo,
        nombre,
        variante,
        precio_usd: Number(precioUsd),
        validez_dias: Number(validezDias),
      }),
    });
    const data = await res.json();
    if (!data.ok) {
      setError(data.error ?? "error_desconocido");
      setEnviando(false);
      return;
    }
    setNombre("");
    setVariante("");
    setPrecioUsd("");
    setValidezDias("");
    setEnviando(false);
    router.refresh();
  }

  return (
    <div className="border rounded p-4 flex flex-col gap-2 max-w-sm">
      <h2 className="font-semibold">Nuevo producto</h2>
      <select className="border rounded px-2 py-1" value={ciudadId} onChange={(e) => setCiudadId(e.target.value)}>
        {ciudades.map((c) => (
          <option key={c.id} value={c.id}>
            {c.nombre}
          </option>
        ))}
      </select>
      <select
        className="border rounded px-2 py-1"
        value={tipo}
        onChange={(e) => setTipo(e.target.value as (typeof TIPOS)[number])}
      >
        {TIPOS.map((t) => (
          <option key={t} value={t}>
            {t}
          </option>
        ))}
      </select>
      <input
        className="border rounded px-2 py-1"
        placeholder="Nombre"
        value={nombre}
        onChange={(e) => setNombre(e.target.value)}
      />
      <input
        className="border rounded px-2 py-1"
        placeholder="Variante (ej: 3 días)"
        value={variante}
        onChange={(e) => setVariante(e.target.value)}
      />
      <input
        className="border rounded px-2 py-1"
        placeholder="Precio USD (adulto)"
        type="number"
        value={precioUsd}
        onChange={(e) => setPrecioUsd(e.target.value)}
      />
      <input
        className="border rounded px-2 py-1"
        placeholder="Validez en días"
        type="number"
        value={validezDias}
        onChange={(e) => setValidezDias(e.target.value)}
      />
      {error && <p className="text-red-600 text-sm">Error: {error}</p>}
      <button
        className="rounded bg-black text-white px-4 py-2 disabled:opacity-50"
        onClick={crear}
        disabled={enviando || !nombre || !variante || !precioUsd || !validezDias || !ciudadId}
      >
        {enviando ? "Creando..." : "Crear"}
      </button>
    </div>
  );
}
