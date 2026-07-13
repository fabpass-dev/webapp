"use client";

import { Minus, Plus } from "lucide-react";
import type { ConfigViaje, Ritmo } from "./tipos";

const DIAS_PILL = [1, 2, 3, 4, 5, 6, 7];
const RITMOS: { valor: Ritmo; titulo: string; texto: string; nota: string }[] = [
  { valor: "tranquilo", titulo: "Tranquilo", texto: "Tiempo libre para perderse por los barrios.", nota: "Máx. 2 pagas / día" },
  { valor: "moderado", titulo: "Moderado", texto: "Equilibrio entre ver y vivir la ciudad.", nota: "Máx. 3 pagas / día" },
  { valor: "intenso", titulo: "Intenso", texto: "Aprovechar cada hora.", nota: "Máx. 3 pagas + gratuitas / día" },
];

function Stepper({ label, valor, min, onChange }: { label: string; valor: number; min: number; onChange: (v: number) => void }) {
  return (
    <div className="flex items-center justify-between">
      <span className="text-sm text-fabpass-cuerpo">{label}</span>
      <div className="flex items-center gap-3">
        <button
          onClick={() => onChange(Math.max(min, valor - 1))}
          className="flex h-11 w-11 items-center justify-center rounded-full border border-fabpass-celeste"
        >
          <Minus size={16} />
        </button>
        <span className="w-6 text-center font-bold">{valor}</span>
        <button
          onClick={() => onChange(valor + 1)}
          className="flex h-11 w-11 items-center justify-center rounded-full border border-fabpass-celeste"
        >
          <Plus size={16} />
        </button>
      </div>
    </div>
  );
}

export function Paso1Configuracion({
  config,
  onChange,
  onAvanzar,
}: {
  config: ConfigViaje;
  onChange: (c: ConfigViaje) => void;
  onAvanzar: () => void;
}) {
  return (
    <div className="mx-auto flex max-w-2xl flex-col gap-5 px-4 py-8">
      <div className="rounded-2xl border border-fabpass-celeste bg-white p-5">
        <h2 className="font-bold text-fabpass-titulo">¿Con quién viajás?</h2>
        <div className="mt-3 flex flex-col gap-4">
          <Stepper label="Adultos" valor={config.adultos} min={1} onChange={(v) => onChange({ ...config, adultos: v })} />
          <Stepper label="Menores 3–12" valor={config.menores} min={0} onChange={(v) => onChange({ ...config, menores: v })} />
        </div>
      </div>

      <div className="rounded-2xl border border-fabpass-celeste bg-white p-5">
        <h2 className="font-bold text-fabpass-titulo">¿Cuántos días querés dedicar a recorrer la ciudad?</h2>
        <div className="mt-3 flex flex-wrap gap-2">
          {DIAS_PILL.map((d) => (
            <button
              key={d}
              onClick={() => onChange({ ...config, diasTurismo: d })}
              className={`h-10 w-10 rounded-full text-sm font-bold ${
                config.diasTurismo === d ? "bg-fabpass-azul text-white" : "border border-fabpass-celeste text-fabpass-cuerpo"
              }`}
            >
              {d}
            </button>
          ))}
          <input
            type="number"
            min={8}
            max={30}
            placeholder="Otro:"
            value={config.diasTurismo > 7 ? config.diasTurismo : ""}
            onChange={(e) => onChange({ ...config, diasTurismo: Number(e.target.value) || 8 })}
            className="w-20 rounded-full border border-fabpass-celeste px-3 text-sm outline-none"
          />
        </div>
      </div>

      <div className="rounded-2xl border border-fabpass-celeste bg-white p-5">
        <h2 className="font-bold text-fabpass-titulo">Fecha de inicio (opcional)</h2>
        <input
          type="date"
          value={config.fechaInicio}
          onChange={(e) => onChange({ ...config, fechaInicio: e.target.value })}
          className="mt-3 rounded-lg border border-fabpass-celeste px-3 py-2 text-sm outline-none"
        />
      </div>

      <div className="rounded-2xl border border-fabpass-celeste bg-white p-5">
        <h2 className="font-bold text-fabpass-titulo">Ritmo de viaje</h2>
        <div className="mt-3 grid grid-cols-1 gap-3 sm:grid-cols-3">
          {RITMOS.map((r) => (
            <button
              key={r.valor}
              onClick={() => onChange({ ...config, ritmo: r.valor })}
              className={`rounded-xl border p-3 text-left ${
                config.ritmo === r.valor ? "border-fabpass-azul bg-fabpass-celeste-fondo" : "border-fabpass-celeste"
              }`}
            >
              <p className="font-bold text-fabpass-titulo">{r.titulo}</p>
              <p className="mt-1 text-xs text-fabpass-cuerpo">{r.texto}</p>
              <p className="mt-1 text-[11px] font-semibold text-fabpass-azul">{r.nota}</p>
            </button>
          ))}
        </div>
      </div>

      <button onClick={onAvanzar} className="self-end rounded-full bg-fabpass-rosa px-6 py-3 font-bold text-white">
        Elegir atracciones →
      </button>
    </div>
  );
}
