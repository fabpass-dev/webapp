"use client";

import { useRef } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { AtraccionCard, type AtraccionCardData } from "./AtraccionCard";

export function CarruselImperdibles({ atracciones, base }: { atracciones: AtraccionCardData[]; base: string }) {
  const ref = useRef<HTMLDivElement>(null);

  if (atracciones.length === 0) return null;

  function scroll(delta: number) {
    ref.current?.scrollBy({ left: delta, behavior: "smooth" });
  }

  return (
    <section className="px-4 py-8 sm:px-6">
      <div className="mx-auto max-w-6xl">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-base font-bold text-fabpass-titulo">Imperdibles</h2>
            <p className="text-xs text-fabpass-muted">Las atracciones más elegidas por los turistas</p>
          </div>
          <div className="flex gap-2">
            <button onClick={() => scroll(-200)} className="flex h-8 w-8 items-center justify-center rounded-full border border-fabpass-celeste">
              <ChevronLeft size={16} />
            </button>
            <button onClick={() => scroll(200)} className="flex h-8 w-8 items-center justify-center rounded-full border border-fabpass-celeste">
              <ChevronRight size={16} />
            </button>
          </div>
        </div>
        <div ref={ref} className="mt-4 flex gap-3 overflow-x-auto pb-2">
          {atracciones.map((a) => (
            <div key={a.slug} className="w-[180px] shrink-0">
              <AtraccionCard atraccion={a} base={base} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
