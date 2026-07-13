"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { SelectorDestinoModal } from "./SelectorDestinoModal";

const IDIOMAS = [
  { codigo: "es", label: "Español" },
  { codigo: "en", label: "English" },
  { codigo: "pt", label: "Português" },
  { codigo: "it", label: "Italiano" },
];

export function Navbar({ locale, ciudades }: { locale: string; ciudades: { nombre: string; slug: string }[] }) {
  const [conScroll, setConScroll] = useState(false);
  const [modalAbierto, setModalAbierto] = useState(false);
  const [idiomaAbierto, setIdiomaAbierto] = useState(false);

  useEffect(() => {
    function onScroll() {
      setConScroll(window.scrollY > 24);
    }
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const idiomaActivo = IDIOMAS.find((i) => i.codigo === locale) ?? IDIOMAS[0];

  return (
    <>
      <nav
        className={`sticky top-0 z-50 flex items-center justify-between px-4 transition-all duration-200 sm:px-6 ${
          conScroll ? "h-12 bg-white/80 backdrop-blur-md shadow-sm" : "h-16 bg-white"
        }`}
      >
        <Link href={`/${locale}`} className="shrink-0">
          <Image
            src="/logo-fabpass-transparente.png"
            alt="FabPass"
            width={120}
            height={38}
            style={{ height: "auto" }}
            className="h-8 w-auto sm:h-9"
            priority
          />
        </Link>

        <div className="flex items-center gap-2 sm:gap-4">
          <div className="relative">
            <button
              onClick={() => setIdiomaAbierto((v) => !v)}
              className="flex items-center gap-1 text-sm text-fabpass-cuerpo"
            >
              🌐 <span className="hidden sm:inline">{idiomaActivo.label}</span>
            </button>
            {idiomaAbierto && (
              <div className="absolute right-0 mt-2 w-40 rounded-lg border border-fabpass-celeste bg-white py-1 shadow-lg">
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

          <button
            onClick={() => setModalAbierto(true)}
            className="rounded-full bg-fabpass-azul px-4 py-2 text-sm font-semibold text-white sm:px-5"
          >
            Elige tu destino
          </button>
        </div>
      </nav>

      {modalAbierto && (
        <SelectorDestinoModal ciudades={ciudades} locale={locale} onClose={() => setModalAbierto(false)} />
      )}
    </>
  );
}
