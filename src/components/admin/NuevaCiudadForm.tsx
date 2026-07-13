"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export function NuevaCiudadForm() {
  const router = useRouter();
  const [nombre, setNombre] = useState("");
  const [slug, setSlug] = useState("");
  const [pais, setPais] = useState("");
  const [moneda, setMoneda] = useState("USD");
  const [enviando, setEnviando] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function crear() {
    setEnviando(true);
    setError(null);
    const res = await fetch("/api/admin/ciudades", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ nombre, slug, pais, moneda }),
    });
    const data = await res.json();
    if (!data.ok) {
      setError(data.error ?? "error_desconocido");
      setEnviando(false);
      return;
    }
    setNombre("");
    setSlug("");
    setPais("");
    setEnviando(false);
    router.refresh();
  }

  return (
    <div className="border rounded p-4 flex flex-col gap-2 max-w-sm">
      <h2 className="font-semibold">Nueva ciudad</h2>
      <input
        className="border rounded px-2 py-1"
        placeholder="Nombre"
        value={nombre}
        onChange={(e) => setNombre(e.target.value)}
      />
      <input
        className="border rounded px-2 py-1"
        placeholder="Slug (ej: buenos-aires)"
        value={slug}
        onChange={(e) => setSlug(e.target.value)}
      />
      <input
        className="border rounded px-2 py-1"
        placeholder="País"
        value={pais}
        onChange={(e) => setPais(e.target.value)}
      />
      <input
        className="border rounded px-2 py-1"
        placeholder="Moneda (ej: USD)"
        value={moneda}
        onChange={(e) => setMoneda(e.target.value)}
      />
      {error && <p className="text-red-600 text-sm">Error: {error}</p>}
      <button
        className="rounded bg-black text-white px-4 py-2 disabled:opacity-50"
        onClick={crear}
        disabled={enviando || !nombre || !slug || !pais || !moneda}
      >
        {enviando ? "Creando..." : "Crear"}
      </button>
    </div>
  );
}
