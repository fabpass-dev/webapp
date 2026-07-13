"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { ChevronDown, Globe, MapPin, ShoppingCart } from "lucide-react";

const IDIOMAS = [
  { codigo: "es", label: "ES" },
  { codigo: "en", label: "EN" },
  { codigo: "pt", label: "PT" },
];

export function CityNavbar({
  locale,
  ciudadNombre,
  ciudades,
}: {
  locale: string;
  ciudadNombre: string;
  ciudades: { nombre: string; slug: string }[];
}) {
  const [modalAbierto, setModalAbierto] = useState(false);
  const [idiomaAbierto, setIdiomaAbierto] = useState(false);
  const idiomaActivo = IDIOMAS.find((i) => i.codigo === locale) ?? IDIOMAS[0];
  // El carrito todavía no existe como funcionalidad real — se muestra en 0/oculto.
  const itemsCarrito = 0;

  return (
    <>
      <nav className="sticky top-0 z-40 flex h-16 items-center justify-between bg-fabpass-azul px-4 sm:px-6">
        <Link href={`/${locale}`} className="shrink-0">
          <Image
            src="/logo-fabpass-transparente.png"
            alt="FabPass"
            width={110}
            height={35}
            style={{ height: "auto" }}
            className="h-8 w-auto brightness-0 invert"
            priority
          />
        </Link>

        <button
          onClick={() => setModalAbierto(true)}
          className="flex items-center gap-1.5 text-sm font-semibold text-white"
        >
          <MapPin size={15} />
          {ciudadNombre}
        </button>

        <div className="flex items-center gap-3">
          <div className="relative">
            <button
              onClick={() => setIdiomaAbierto((v) => !v)}
              className="flex items-center gap-1 rounded-full bg-white/10 px-2.5 py-1.5 text-sm font-semibold text-white"
            >
              <Globe size={14} />
              {idiomaActivo.label}
              <ChevronDown size={12} />
            </button>
            {idiomaAbierto && (
              <div className="absolute right-0 mt-2 w-32 rounded-xl border border-fabpass-celeste bg-white py-1 shadow-lg">
                {IDIOMAS.map((i) => (
                  <button
                    key={i.codigo}
                    onClick={() => setIdiomaAbierto(false)}
                    className="block w-full px-4 py-2 text-left text-sm text-fabpass-cuerpo hover:bg-fabpass-celeste-fondo"
                  >
                    {i.label}
                  </button>
                ))}
              </div>
            )}
          </div>

          {itemsCarrito > 0 && (
            <button className="relative text-white">
              <ShoppingCart size={20} />
              <span className="absolute -top-1.5 -right-1.5 flex h-4 w-4 items-center justify-center rounded-full bg-fabpass-rosa text-[10px] font-bold">
                {itemsCarrito}
              </span>
            </button>
          )}
        </div>
      </nav>

      {modalAbierto && (
        <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/50 sm:items-center" onClick={() => setModalAbierto(false)}>
          <div className="w-full max-w-md rounded-t-2xl bg-white p-6 sm:rounded-2xl" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-bold text-fabpass-titulo">Elegí tu destino</h2>
              <button onClick={() => setModalAbierto(false)} className="text-2xl leading-none text-fabpass-muted">
                ×
              </button>
            </div>
            <div className="mt-4 flex flex-col gap-2">
              {ciudades.map((c) => (
                <Link
                  key={c.slug}
                  href={`/${locale}/${c.slug}`}
                  onClick={() => setModalAbierto(false)}
                  className="rounded-xl border border-fabpass-celeste px-4 py-3 font-semibold text-fabpass-azul hover:bg-fabpass-celeste-fondo"
                >
                  {c.nombre}
                </Link>
              ))}
            </div>
            <p className="mt-4 text-center text-xs text-fabpass-muted">Próximamente más ciudades.</p>
          </div>
        </div>
      )}
    </>
  );
}
