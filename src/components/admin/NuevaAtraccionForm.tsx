"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

type Ciudad = { id: string; nombre: string };

export function NuevaAtraccionForm({ ciudades }: { ciudades: Ciudad[] }) {
  const router = useRouter();
  const [nombre, setNombre] = useState("");
  const [categoria, setCategoria] = useState("");
  const [ciudadId, setCiudadId] = useState(ciudades[0]?.id ?? "");
  const [precioMayor, setPrecioMayor] = useState("");
  const [comisionPct, setComisionPct] = useState("50");
  const [enviando, setEnviando] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function crear() {
    setEnviando(true);
    setError(null);
    const res = await fetch("/api/admin/atracciones", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        nombre,
        categoria,
        ciudad_id: ciudadId,
        precio_mayor: Number(precioMayor),
        comision_pct_default: Number(comisionPct),
      }),
    });
    const data = await res.json();
    if (!data.ok) {
      setError(data.error ?? "error_desconocido");
      setEnviando(false);
      return;
    }
    setNombre("");
    setCategoria("");
    setPrecioMayor("");
    setEnviando(false);
    router.refresh();
  }

  return (
    <div className="border rounded p-4 flex flex-col gap-2 max-w-sm">
      <h2 className="font-semibold">Nueva atracción</h2>
      <input
        className="border rounded px-2 py-1"
        placeholder="Nombre"
        value={nombre}
        onChange={(e) => setNombre(e.target.value)}
      />
      <input
        className="border rounded px-2 py-1"
        placeholder="Categoría"
        value={categoria}
        onChange={(e) => setCategoria(e.target.value)}
      />
      <select className="border rounded px-2 py-1" value={ciudadId} onChange={(e) => setCiudadId(e.target.value)}>
        {ciudades.map((c) => (
          <option key={c.id} value={c.id}>
            {c.nombre}
          </option>
        ))}
      </select>
      <input
        className="border rounded px-2 py-1"
        placeholder="Precio USD (adulto)"
        type="number"
        value={precioMayor}
        onChange={(e) => setPrecioMayor(e.target.value)}
      />
      <input
        className="border rounded px-2 py-1"
        placeholder="% comisión negociada"
        type="number"
        value={comisionPct}
        onChange={(e) => setComisionPct(e.target.value)}
      />
      {error && <p className="text-red-600 text-sm">Error: {error}</p>}
      <button
        className="rounded bg-black text-white px-4 py-2 disabled:opacity-50"
        onClick={crear}
        disabled={enviando || !nombre || !precioMayor || !ciudadId}
      >
        {enviando ? "Creando..." : "Crear"}
      </button>
    </div>
  );
}
