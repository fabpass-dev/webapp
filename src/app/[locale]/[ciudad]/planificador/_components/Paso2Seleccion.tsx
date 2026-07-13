"use client";

import { useMemo, useState } from "react";
import { X } from "lucide-react";
import type { AtraccionPlanificador, ConfigViaje } from "./tipos";
import { formatVariante, recomendarPase, type ProductoVariante } from "@/lib/planificador/recomendar-pase";

const CATEGORIAS_TODAS = "Todas";

export function Paso2Seleccion({
  atracciones,
  productos,
  config,
  seleccionadas,
  onCambiarSeleccion,
  onGenerar,
}: {
  atracciones: AtraccionPlanificador[];
  productos: ProductoVariante[];
  config: ConfigViaje;
  seleccionadas: Set<string>;
  onCambiarSeleccion: (s: Set<string>) => void;
  onGenerar: () => void;
}) {
  const [categoriasFiltro, setCategoriasFiltro] = useState<string[]>([CATEGORIAS_TODAS]);
  const [drawerId, setDrawerId] = useState<string | null>(null);

  const categoriasDisponibles = useMemo(() => {
    const set = new Set<string>();
    atracciones.forEach((a) => a.categorias.forEach((c) => set.add(c)));
    return [CATEGORIAS_TODAS, ...Array.from(set).sort()];
  }, [atracciones]);

  const filtradas = categoriasFiltro.includes(CATEGORIAS_TODAS)
    ? atracciones
    : atracciones.filter((a) => a.categorias.some((c) => categoriasFiltro.includes(c)));

  function toggleCategoria(c: string) {
    if (c === CATEGORIAS_TODAS) {
      setCategoriasFiltro([CATEGORIAS_TODAS]);
      return;
    }
    const sinTodas = categoriasFiltro.filter((x) => x !== CATEGORIAS_TODAS);
    const nuevas = sinTodas.includes(c) ? sinTodas.filter((x) => x !== c) : [...sinTodas, c];
    setCategoriasFiltro(nuevas.length === 0 ? [CATEGORIAS_TODAS] : nuevas);
  }

  function toggleSeleccion(id: string) {
    const nueva = new Set(seleccionadas);
    if (nueva.has(id)) nueva.delete(id);
    else nueva.add(id);
    onCambiarSeleccion(nueva);
  }

  const listaSeleccionadas = atracciones.filter((a) => seleccionadas.has(a.id));
  const pagas = listaSeleccionadas.filter((a) => !a.gratuito);
  const precioSinPase = pagas.reduce((s, a) => s + a.precio_mayor, 0);
  const recomendacion =
    pagas.length >= 2 ? recomendarPase(productos, config.diasTurismo, pagas.length, precioSinPase) : null;

  const atraccionDrawer = atracciones.find((a) => a.id === drawerId) ?? null;

  return (
    <div className="mx-auto max-w-6xl px-4 py-6 lg:grid lg:grid-cols-[1fr_340px] lg:gap-8">
      <div>
        <div className="flex gap-2 overflow-x-auto pb-3">
          {categoriasDisponibles.map((c) => (
            <button
              key={c}
              onClick={() => toggleCategoria(c)}
              className={`shrink-0 rounded-full px-3 py-1.5 text-xs font-semibold whitespace-nowrap ${
                categoriasFiltro.includes(c) ? "bg-fabpass-azul text-white" : "border border-fabpass-celeste text-fabpass-cuerpo"
              }`}
            >
              {c}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
          {filtradas.map((a) => {
            const elegida = seleccionadas.has(a.id);
            return (
              <div
                key={a.id}
                className={`overflow-hidden rounded-xl border border-fabpass-celeste bg-white shadow-sm ${elegida ? "opacity-50" : ""}`}
              >
                <div className="flex aspect-video items-center justify-center bg-gradient-to-br from-fabpass-azul to-fabpass-medio">
                  <span className="text-xl font-bold text-white/30">{a.nombre.slice(0, 1)}</span>
                </div>
                <div className="p-3">
                  <button onClick={() => setDrawerId(a.id)} className="text-left text-[13px] font-bold text-fabpass-azul">
                    {elegida ? "✓ " : ""}
                    {a.nombre}
                  </button>
                  <p className="text-[11px] text-fabpass-muted">{a.categorias[0]}</p>
                  {a.gratuito ? (
                    <p className="mt-1 inline-block rounded bg-fabpass-exito/15 px-1.5 py-0.5 text-[10px] font-bold text-fabpass-exito">
                      Gratuita
                    </p>
                  ) : (
                    <p className="mt-1 text-[11px] text-fabpass-muted line-through">USD {a.precio_mayor}</p>
                  )}
                  <div className="mt-2">
                    {elegida ? (
                      <span className="text-xs font-bold text-fabpass-exito">✓ Agregada</span>
                    ) : (
                      <button
                        onClick={() => toggleSeleccion(a.id)}
                        className="flex h-7 w-7 items-center justify-center rounded-full bg-fabpass-azul text-white"
                      >
                        +
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <aside className="mt-8 lg:sticky lg:top-40 lg:mt-0 lg:h-fit">
        <div className="rounded-2xl border border-fabpass-celeste bg-white p-4">
          <p className="text-[13px] font-bold text-fabpass-titulo">Tu selección</p>
          <p className="mt-2 text-sm text-fabpass-cuerpo">{listaSeleccionadas.length} atracciones elegidas</p>
          <p className="text-sm text-fabpass-cuerpo">{config.diasTurismo} días de turismo</p>
          <p className="mt-1 text-sm font-semibold text-fabpass-titulo">Precio sin pase: USD {precioSinPase}</p>

          {recomendacion && (
            <div className="mt-3 rounded-xl bg-[#E1F5EE] p-3">
              <p className="text-[11px] text-fabpass-cuerpo">Ahorro estimado con FabPass</p>
              <p className="text-lg font-bold text-[#0F6E56]">USD {recomendacion.ahorro.toFixed(0)}</p>
              <p className="mt-1 text-xs text-fabpass-cuerpo">
                {recomendacion.recomendado === "fabdays"
                  ? `FabDays ${formatVariante(recomendacion.fabdays?.variante ?? "")} · USD ${recomendacion.fabdays?.precio}/persona`
                  : `FabFlex ${formatVariante(recomendacion.fabflex?.variante ?? "")} · USD ${recomendacion.fabflex?.precio}/persona`}
              </p>
            </div>
          )}

          {listaSeleccionadas.length > 0 && (
            <div className="mt-3 flex max-h-48 flex-col gap-2 overflow-y-auto">
              {listaSeleccionadas.map((a) => (
                <div key={a.id} className="flex items-center justify-between text-xs">
                  <span className="truncate">{a.nombre}</span>
                  <button onClick={() => toggleSeleccion(a.id)} className="text-fabpass-rosa">
                    −
                  </button>
                </div>
              ))}
            </div>
          )}

          <button
            onClick={onGenerar}
            disabled={listaSeleccionadas.length === 0}
            className="mt-4 w-full rounded-full bg-fabpass-rosa py-3 font-bold text-white disabled:opacity-40"
          >
            Generar itinerario →
          </button>
        </div>
      </aside>

      {atraccionDrawer && (
        <div className="fixed inset-0 z-40 flex justify-end bg-black/35" onClick={() => setDrawerId(null)}>
          <div className="h-full w-full max-w-sm overflow-y-auto bg-white p-6" onClick={(e) => e.stopPropagation()}>
            <button onClick={() => setDrawerId(null)} className="text-2xl text-fabpass-muted">
              <X size={20} />
            </button>
            <div className="mt-3 flex aspect-video items-center justify-center rounded-xl bg-gradient-to-br from-fabpass-azul to-fabpass-medio">
              <span className="text-3xl font-bold text-white/30">{atraccionDrawer.nombre.slice(0, 1)}</span>
            </div>
            <h2 className="mt-4 text-lg font-bold text-fabpass-titulo">{atraccionDrawer.nombre}</h2>
            <p className="text-sm text-fabpass-muted">
              {atraccionDrawer.categorias.join(", ")} · {atraccionDrawer.barrio}
            </p>
            {atraccionDrawer.descripcion && <p className="mt-3 text-sm text-fabpass-cuerpo">{atraccionDrawer.descripcion}</p>}
            <div className="mt-3 flex flex-col gap-1 text-sm text-fabpass-cuerpo">
              {atraccionDrawer.duracion_horas && <p>Duración estimada: {atraccionDrawer.duracion_horas}hs</p>}
              {atraccionDrawer.horario_apertura && (
                <p>
                  Horario: {atraccionDrawer.horario_apertura} a {atraccionDrawer.horario_cierre}
                </p>
              )}
            </div>
            {atraccionDrawer.gratuito ? (
              <p className="mt-3 font-bold text-fabpass-exito">Gratuita</p>
            ) : (
              <p className="mt-3 text-sm">
                <span className="text-fabpass-muted line-through">USD {atraccionDrawer.precio_mayor}</span>{" "}
                <span className="font-bold text-fabpass-azul">Con FabPass: incluida en tu pase</span>
              </p>
            )}
            <button
              onClick={() => {
                toggleSeleccion(atraccionDrawer.id);
                setDrawerId(null);
              }}
              disabled={seleccionadas.has(atraccionDrawer.id)}
              className="mt-4 w-full rounded-full bg-fabpass-rosa py-3 font-bold text-white disabled:opacity-40"
            >
              {seleccionadas.has(atraccionDrawer.id) ? "✓ Ya en tu selección" : "+ Agregar al itinerario"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
