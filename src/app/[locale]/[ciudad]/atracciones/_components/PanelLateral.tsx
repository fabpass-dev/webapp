"use client";

import Link from "next/link";
import { useState } from "react";

export function PanelLateral({ base, precioDays, precioFlex }: { base: string; precioDays: number; precioFlex: number }) {
  const [abierto, setAbierto] = useState(false);

  const contenido = (
    <div className="flex flex-col gap-4">
      <div className="rounded-xl border border-fabpass-celeste bg-white p-4">
        <p className="text-[13px] font-bold text-fabpass-titulo">¿Cuál es tu pase?</p>
        <span className="mt-1 inline-block rounded-full bg-[#E1F5EE] px-2 py-0.5 text-xs font-semibold text-[#085041]">
          Ahorrás hasta 43% vs. comprar por separado
        </span>
        <div className="mt-3">
          <p className="text-xs text-fabpass-muted">FabDays · desde</p>
          <p className="text-xl font-bold text-fabpass-azul">USD {precioDays} / persona</p>
          <p className="mt-1 text-xs text-fabpass-cuerpo">Acceso ilimitado por días. 1, 3, 5 o 7 días consecutivos.</p>
          <Link href={`${base}/productos`} className="mt-2 block rounded-full bg-fabpass-rosa py-2 text-center text-sm font-bold text-white">
            Comprar FabDays
          </Link>
        </div>
        <div className="my-3 border-t border-fabpass-celeste" />
        <div>
          <p className="text-xs text-fabpass-muted">FabFlex · desde</p>
          <p className="text-xl font-bold text-[#4A7CC7]">USD {precioFlex} / persona</p>
          <Link href={`${base}/productos`} className="mt-2 block rounded-full border-2 border-[#4A7CC7] py-2 text-center text-sm font-bold text-[#4A7CC7]">
            Comprar FabFlex
          </Link>
        </div>
      </div>

      <div className="rounded-xl bg-fabpass-profundo p-4 text-white">
        <p className="text-[13px] font-bold">FabBlack</p>
        <p className="mt-1 text-xs text-white/70">Experiencias premium con descuento exclusivo. Polo, helicóptero, gastronomía privada.</p>
        <Link href={`${base}/premium`} className="mt-2 block rounded-full bg-fabpass-rosa py-2 text-center text-sm font-bold text-white">
          Ver experiencias
        </Link>
      </div>

      <div className="rounded-xl border border-[#B5D4F4] bg-fabpass-celeste-fondo p-4">
        <p className="text-[13px] font-bold text-fabpass-azul">¿No sabés cuál elegir?</p>
        <p className="mt-1 text-xs text-fabpass-cuerpo">
          El planificador analiza las atracciones que querés ver y te dice cuál pase te conviene más.
        </p>
        <Link href={`${base}/planificador`} className="mt-2 block rounded-full bg-fabpass-azul py-2 text-center text-sm font-bold text-white">
          Planificar mi viaje gratis
        </Link>
      </div>
    </div>
  );

  return (
    <>
      <aside className="hidden lg:sticky lg:top-24 lg:block lg:w-full lg:self-start">{contenido}</aside>

      <div className="fixed inset-x-0 bottom-0 z-30 flex items-center justify-between border-t border-fabpass-celeste bg-white px-4 py-3 lg:hidden">
        <p className="text-sm text-fabpass-cuerpo">Desde USD {precioDays}/persona</p>
        <button onClick={() => setAbierto(true)} className="rounded-full bg-fabpass-rosa px-5 py-2.5 text-sm font-bold text-white">
          Comprar pase
        </button>
      </div>

      {abierto && (
        <div className="fixed inset-0 z-40 flex items-end bg-black/50 lg:hidden" onClick={() => setAbierto(false)}>
          <div className="max-h-[80vh] w-full overflow-y-auto rounded-t-2xl bg-fabpass-fondo-claro p-4 pb-24" onClick={(e) => e.stopPropagation()}>
            {contenido}
          </div>
        </div>
      )}
    </>
  );
}
