"use client";

import Link from "next/link";

type Ciudad = { nombre: string; slug: string };

export function SelectorDestinoModal({
  ciudades,
  locale,
  onClose,
}: {
  ciudades: Ciudad[];
  locale: string;
  onClose: () => void;
}) {
  return (
    <div className="fixed inset-0 z-[60] flex items-end justify-center bg-black/50 sm:items-center" onClick={onClose}>
      <div
        className="w-full max-w-md rounded-t-2xl bg-white p-6 sm:rounded-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold text-fabpass-titulo">Elegí tu destino</h2>
          <button onClick={onClose} className="text-2xl leading-none text-fabpass-muted" aria-label="Cerrar">
            ×
          </button>
        </div>
        <div className="mt-4 flex flex-col gap-2">
          {ciudades.map((c) => (
            <Link
              key={c.slug}
              href={`/${locale}/${c.slug}`}
              onClick={onClose}
              className="rounded-xl border border-fabpass-celeste px-4 py-3 font-semibold text-fabpass-azul hover:bg-fabpass-celeste-fondo"
            >
              {c.nombre}
            </Link>
          ))}
          {ciudades.length === 0 && (
            <p className="text-sm text-fabpass-muted">Todavía no hay ciudades disponibles.</p>
          )}
        </div>
        <p className="mt-4 text-center text-xs text-fabpass-muted">Próximamente más ciudades.</p>
      </div>
    </div>
  );
}
