"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import { Search } from "lucide-react";

const TIPOS = [
  { valor: "todos", label: "Todos" },
  { valor: "fabdays", label: "FabDays", color: "bg-fabpass-azul text-white" },
  { valor: "fabflex", label: "FabFlex", color: "bg-[#4A7CC7] text-white" },
  { valor: "fabblack", label: "FabBlack", color: "bg-[#222222] text-white" },
  { valor: "fablife", label: "FabLife", color: "bg-[#1D9E75] text-white" },
];

const CATEGORIAS = [
  "Vistas de la ciudad", "Arte y museos", "Historia y cultura", "Monumentos", "Tours y recorridos",
  "Transporte turístico", "Gastronomía", "Shows y espectáculos", "Tango", "Deporte y estadios",
  "Naturaleza y parques", "Excursiones de día", "Compras", "Experiencias únicas", "Estancias",
  "Experiencias culturales privadas", "Experiencias aéreas", "Restaurantes y parrillas", "Bares y cafés",
  "Hoteles", "Tiendas", "Spas", "Traslados",
];

const MAS_FILTROS = [
  { valor: "reserva", label: "Requiere reserva" },
  { valor: "aire_libre", label: "Al aire libre" },
  { valor: "con_techo", label: "Con techo" },
  { valor: "familia", label: "Apto familia" },
  { valor: "adultos", label: "Solo adultos" },
  { valor: "gratuitas", label: "Gratuitas" },
];

function useUrlParam(name: string) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const valor = searchParams.get(name) ?? "";

  function set(nuevoValor: string) {
    const params = new URLSearchParams(searchParams.toString());
    if (nuevoValor) params.set(name, nuevoValor);
    else params.delete(name);
    router.push(`?${params.toString()}`, { scroll: false });
  }

  return [valor, set] as const;
}

export function Buscador() {
  const [q, setQ] = useUrlParam("q");
  const [texto, setTexto] = useState(q);

  return (
    <div className="mx-auto flex max-w-lg items-center rounded-full border border-fabpass-celeste bg-white shadow-sm">
      <input
        className="flex-1 rounded-full bg-transparent px-5 py-3 text-sm outline-none"
        placeholder="¿Qué querés ver?"
        value={texto}
        onChange={(e) => {
          setTexto(e.target.value);
          setQ(e.target.value);
        }}
      />
      <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-fabpass-azul text-white mr-1">
        <Search size={16} />
      </span>
    </div>
  );
}

export function FiltrosBar() {
  const [tipo, setTipo] = useUrlParam("tipo");
  const [cat, setCat] = useUrlParam("cat");
  const [mas, setMas] = useUrlParam("mas");

  const catsActivas = cat ? cat.split(",") : [];
  const masActivos = mas ? mas.split(",") : [];

  function toggleCat(c: string) {
    const nuevas = catsActivas.includes(c) ? catsActivas.filter((x) => x !== c) : [...catsActivas, c];
    setCat(nuevas.join(","));
  }

  function toggleMas(m: string) {
    const nuevos = masActivos.includes(m) ? masActivos.filter((x) => x !== m) : [...masActivos, m];
    setMas(nuevos.join(","));
  }

  return (
    <div className="flex flex-col gap-3 border-b border-fabpass-celeste bg-white px-4 py-4 sm:px-6">
      <div className="flex flex-wrap gap-2">
        {TIPOS.map((t) => (
          <button
            key={t.valor}
            onClick={() => setTipo(t.valor === "todos" ? "" : t.valor)}
            className={`rounded-full px-3 py-1.5 text-xs font-bold whitespace-nowrap ${
              (tipo || "todos") === t.valor ? (t.color ?? "bg-fabpass-azul text-white") : "border border-fabpass-celeste text-fabpass-cuerpo"
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>
      <div className="flex flex-wrap gap-2">
        {CATEGORIAS.map((c) => (
          <button
            key={c}
            onClick={() => toggleCat(c)}
            className={`rounded-full px-3 py-1 text-xs whitespace-nowrap ${
              catsActivas.includes(c) ? "bg-fabpass-celeste-fondo font-semibold text-fabpass-azul" : "border border-fabpass-celeste text-fabpass-muted"
            }`}
          >
            {c}
          </button>
        ))}
      </div>
      <div className="flex flex-wrap gap-2">
        {MAS_FILTROS.map((m) => (
          <button
            key={m.valor}
            onClick={() => toggleMas(m.valor)}
            className={`rounded-full px-3 py-1 text-xs whitespace-nowrap ${
              masActivos.includes(m.valor) ? "bg-fabpass-celeste-fondo font-semibold text-fabpass-azul" : "border border-fabpass-celeste text-fabpass-muted"
            }`}
          >
            {m.label}
          </button>
        ))}
      </div>
    </div>
  );
}
