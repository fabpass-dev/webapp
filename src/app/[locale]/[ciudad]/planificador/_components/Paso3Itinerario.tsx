"use client";

import { useState } from "react";
import { MapPin } from "lucide-react";
import type { DiaItinerario } from "@/lib/planificador/generar-itinerario";
import { formatVariante, type Recomendacion } from "@/lib/planificador/recomendar-pase";
import type { ConfigViaje } from "./tipos";

function linkDirecciones(origenLat: number, origenLng: number, destLat: number, destLng: number) {
  return `https://www.google.com/maps/dir/?api=1&origin=${origenLat},${origenLng}&destination=${destLat},${destLng}`;
}

export function Paso3Itinerario({
  dias,
  recomendacion,
  config,
  atraccionesIds,
  base,
  onEditar,
}: {
  dias: DiaItinerario[];
  recomendacion: Recomendacion | null;
  config: ConfigViaje;
  atraccionesIds: string[];
  base: string;
  onEditar: () => void;
}) {
  const [email, setEmail] = useState("");
  const [guardando, setGuardando] = useState(false);
  const [guardado, setGuardado] = useState<string | null>(null);

  const totalActividades = dias.reduce((s, d) => s + d.actividades.length, 0);

  async function guardarItinerario() {
    setGuardando(true);
    const res = await fetch("/api/itinerarios", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email,
        dias_turismo: config.diasTurismo,
        adultos: config.adultos,
        menores: config.menores,
        ritmo: config.ritmo,
        fecha_inicio: config.fechaInicio || null,
        atracciones_ids: atraccionesIds,
        pase_recomendado: recomendacion?.recomendado,
        variante_recomendada:
          recomendacion?.recomendado === "fabdays" ? recomendacion.fabdays?.variante : recomendacion?.fabflex?.variante,
        ahorro_estimado: recomendacion?.ahorro,
      }),
    });
    const data = await res.json();
    setGuardando(false);
    setGuardado(data.ok ? "Te mandamos el link para volver a verlo cuando quieras." : "No pudimos guardarlo, probá de nuevo.");
  }

  const varianteRecomendada = recomendacion?.recomendado === "fabdays" ? recomendacion.fabdays : recomendacion?.fabflex;

  return (
    <div className="mx-auto max-w-3xl px-4 py-8">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-fabpass-cuerpo">
            {config.diasTurismo} días de turismo · {config.adultos + config.menores} personas · {totalActividades} actividades
          </p>
        </div>
        <button onClick={onEditar} className="rounded-full border border-fabpass-azul px-4 py-2 text-sm font-bold text-fabpass-azul">
          Editar
        </button>
      </div>

      <div className="mt-6 flex flex-col gap-6">
        {dias.map((dia) => (
          <div key={dia.numero} className="overflow-hidden rounded-2xl border border-fabpass-celeste">
            <div className="bg-fabpass-azul px-4 py-3 text-white">
              <p className="font-bold">{dia.label}</p>
              <p className="text-xs text-white/80">
                {dia.actividades.filter((a) => !a.atraccion.gratuito).length} atracciones del pase ·{" "}
                {dia.actividades.filter((a) => a.atraccion.gratuito).length} gratuitas
              </p>
            </div>

            {/* El mapa con pines numerados por día queda pendiente de la API key
                de Google Maps (a cargar más adelante). */}
            <div className="flex items-center justify-center gap-2 bg-fabpass-fondo-claro p-6 text-sm text-fabpass-muted">
              <MapPin size={16} />
              Mapa del día — se activa cuando carguemos la key de Google Maps
            </div>

            <div className="flex flex-col divide-y divide-fabpass-celeste">
              {dia.actividades.map((act) => (
                <div key={act.atraccion.id} className="flex gap-3 p-4">
                  <span
                    className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-xs font-bold text-white ${
                      act.atraccion.gratuito ? "bg-fabpass-exito" : "bg-fabpass-azul"
                    }`}
                  >
                    {act.orden}
                  </span>
                  <div className="flex-1">
                    <p className="text-sm font-bold text-fabpass-titulo">{act.atraccion.nombre}</p>
                    <p className="text-xs text-fabpass-muted">
                      {act.atraccion.barrio} · {act.horario} ·{" "}
                      {act.atraccion.duracion_horas ? `${act.atraccion.duracion_horas}hs` : ""}
                    </p>
                    <p className="mt-1 text-xs text-fabpass-cuerpo">
                      {act.atraccion.gratuito
                        ? "Gratuita — incluida en el planificador"
                        : `USD ${act.atraccion.precio_mayor} — cubierta por tu pase FabPass`}
                    </p>
                    {act.distanciaSiguienteKm != null && act.atraccion.lat != null && act.atraccion.lng != null && (
                      <a
                        href={linkDirecciones(
                          act.atraccion.lat,
                          act.atraccion.lng,
                          dia.actividades[act.orden]?.atraccion.lat ?? act.atraccion.lat,
                          dia.actividades[act.orden]?.atraccion.lng ?? act.atraccion.lng,
                        )}
                        target="_blank"
                        className="mt-1 inline-block text-xs font-semibold text-fabpass-azul underline"
                      >
                        {act.distanciaSiguienteKm.toFixed(1)} km a la siguiente · Cómo llegar
                      </a>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {recomendacion && (
        <section className="mt-8">
          <h2 className="text-center text-lg font-bold text-fabpass-titulo">¿Qué pase te conviene?</h2>
          <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2">
            {(["fabdays", "fabflex"] as const).map((tipo) => {
              const info = tipo === "fabdays" ? recomendacion.fabdays : recomendacion.fabflex;
              if (!info) return null;
              const esRecomendado = recomendacion.recomendado === tipo;
              return (
                <div
                  key={tipo}
                  className={`rounded-xl border p-4 ${esRecomendado ? "border-[1.5px] border-fabpass-azul" : "border-fabpass-celeste"}`}
                >
                  <span
                    className={`rounded-full px-2 py-0.5 text-xs font-bold ${
                      esRecomendado ? "bg-[#E6F1FB] text-[#0C447C]" : "bg-gray-100 text-gray-500"
                    }`}
                  >
                    {esRecomendado ? "Recomendado" : "Alternativa"}
                  </span>
                  <p className="mt-2 font-bold text-fabpass-titulo">
                    {tipo === "fabdays" ? "FabDays" : "FabFlex"} {formatVariante(info.variante)}
                  </p>
                  <p className="text-lg font-bold text-fabpass-azul">USD {info.precio} / persona</p>
                  <p className="text-sm font-semibold text-fabpass-exito">Ahorro: USD {recomendacion.ahorro.toFixed(0)}</p>
                </div>
              );
            })}
          </div>
          <a
            href={`${base}/carrito?producto=${recomendacion.recomendado}&variante=${varianteRecomendada?.variante}&adultos=${config.adultos}&menores=${config.menores}`}
            className="mt-4 block rounded-full bg-fabpass-rosa py-3 text-center font-bold text-white"
          >
            Comprar {recomendacion.recomendado === "fabdays" ? "FabDays" : "FabFlex"} →
          </a>
        </section>
      )}

      <div className="mt-6 rounded-xl bg-[#F0F5FA] p-4">
        <p className="font-bold text-fabpass-titulo">Guardá tu itinerario</p>
        <p className="mt-1 text-sm text-fabpass-cuerpo">
          Ingresá tu email y te mandamos el link para volver a verlo cuando quieras — sin necesidad de comprar.
        </p>
        {guardado ? (
          <p className="mt-2 text-sm font-semibold text-fabpass-azul">{guardado}</p>
        ) : (
          <div className="mt-2 flex gap-2">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="tu@email.com"
              className="flex-1 rounded-full border border-fabpass-celeste px-4 py-2 text-sm outline-none"
            />
            <button
              onClick={guardarItinerario}
              disabled={guardando || !email.includes("@")}
              className="rounded-full bg-fabpass-azul px-5 py-2 text-sm font-bold text-white disabled:opacity-50"
            >
              {guardando ? "..." : "Guardar →"}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
