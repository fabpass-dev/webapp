"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { ChevronDown, Globe, MapPin } from "lucide-react";
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

        <div className="flex items-center gap-2 sm:gap-3">
          <div className="relative">
            <button
              onClick={() => setIdiomaAbierto((v) => !v)}
              className="flex items-center gap-1.5 rounded-full border border-fabpass-celeste bg-white px-3 py-2 text-sm font-semibold text-fabpass-cuerpo shadow-sm"
            >
              <Globe size={15} className="text-fabpass-azul" />
              <span className="hidden sm:inline">{idiomaActivo.codigo.toUpperCase()}</span>
              <ChevronDown size={14} className="text-fabpass-muted" />
            </button>
            {idiomaAbierto && (
              <div className="absolute right-0 mt-2 w-40 rounded-xl border border-fabpass-celeste bg-white py-1 shadow-lg">
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
            className="flex items-center gap-1.5 rounded-full bg-fabpass-azul px-4 py-2.5 text-sm font-semibold text-white shadow-sm shadow-fabpass-azul/30 transition-transform hover:scale-[1.02] sm:px-5"
          >
            <MapPin size={15} />
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
