"use client";

import { useState } from "react";
import { Paso1Configuracion } from "./Paso1Configuracion";
import { Paso2Seleccion } from "./Paso2Seleccion";
import { Paso3Itinerario } from "./Paso3Itinerario";
import type { AtraccionPlanificador, ConfigViaje } from "./tipos";
import { diasNecesarios, generarItinerario, type DiaItinerario } from "@/lib/planificador/generar-itinerario";
import { recomendarPase, type ProductoVariante, type Recomendacion } from "@/lib/planificador/recomendar-pase";

const PASOS = ["Configuración", "Atracciones", "Itinerario"];

export function PlanificadorWizard({
  atracciones,
  productos,
  base,
}: {
  atracciones: AtraccionPlanificador[];
  productos: ProductoVariante[];
  base: string;
}) {
  const [paso, setPaso] = useState(0);
  const [config, setConfig] = useState<ConfigViaje>({
    adultos: 2,
    menores: 0,
    diasTurismo: 3,
    fechaInicio: "",
    ritmo: "moderado",
  });
  const [seleccionadas, setSeleccionadas] = useState<Set<string>>(new Set());
  const [dias, setDias] = useState<DiaItinerario[]>([]);
  const [recomendacion, setRecomendacion] = useState<Recomendacion | null>(null);

  function generar() {
    const elegidas = atracciones.filter((a) => seleccionadas.has(a.id));
    setDias(generarItinerario(elegidas, config.ritmo, config.fechaInicio || null));

    const pagas = elegidas.filter((a) => !a.gratuito);
    const gratuitas = elegidas.filter((a) => a.gratuito);
    const precioSinPase = pagas.reduce((s, a) => s + a.precio_mayor, 0);
    // Los días que realmente necesita el itinerario mandan sobre lo elegido
    // en el Paso 1 — eso era solo una intención inicial.
    const dias = diasNecesarios(pagas.length, gratuitas.length > 0, config.ritmo);
    setRecomendacion(recomendarPase(productos, dias, pagas.length, precioSinPase));
    setPaso(2);
  }

  return (
    <div>
      <div className="mx-auto flex max-w-md items-center justify-center gap-3 px-4 pt-6">
        {PASOS.map((p, i) => (
          <div key={p} className="flex items-center gap-2">
            <span
              className={`flex h-6 w-6 items-center justify-center rounded-full text-xs font-bold ${
                i === paso ? "bg-fabpass-azul text-white" : i < paso ? "bg-fabpass-exito text-white" : "bg-gray-200 text-gray-500"
              }`}
            >
              {i + 1}
            </span>
            {i < PASOS.length - 1 && <span className="h-px w-8 bg-fabpass-celeste" />}
          </div>
        ))}
      </div>

      {paso === 0 && <Paso1Configuracion config={config} onChange={setConfig} onAvanzar={() => setPaso(1)} />}
      {paso === 1 && (
        <Paso2Seleccion
          atracciones={atracciones}
          productos={productos}
          config={config}
          seleccionadas={seleccionadas}
          onCambiarSeleccion={setSeleccionadas}
          onGenerar={generar}
        />
      )}
      {paso === 2 && (
        <Paso3Itinerario
          dias={dias}
          recomendacion={recomendacion}
          config={config}
          atraccionesIds={[...seleccionadas]}
          base={base}
          onEditar={() => setPaso(1)}
        />
      )}
    </div>
  );
}
