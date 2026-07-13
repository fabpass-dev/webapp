"use client";

import { useState } from "react";
import { MapPin } from "lucide-react";
import { SelectorDestinoModal } from "./SelectorDestinoModal";

export function Hero({ locale, ciudades }: { locale: string; ciudades: { nombre: string; slug: string }[] }) {
  const [modalAbierto, setModalAbierto] = useState(false);

  return (
    <section className="relative flex min-h-[80vh] items-center overflow-hidden bg-gradient-to-br from-fabpass-profundo via-[#243B55] to-fabpass-profundo sm:min-h-[85vh]">
      {/* Sin foto real disponible todavía — textura decorativa en su lugar. */}
      <div className="pointer-events-none absolute -top-32 -right-32 h-96 w-96 rounded-full bg-fabpass-rosa/20 blur-3xl" />
      <div className="pointer-events-none absolute bottom-0 left-1/4 h-72 w-72 rounded-full bg-fabpass-azul/30 blur-3xl" />
      <div className="pointer-events-none absolute inset-0 opacity-[0.03]" style={{ backgroundImage: "radial-gradient(circle, white 1px, transparent 1px)", backgroundSize: "28px 28px" }} />

      <div className="relative z-10 mx-auto flex w-full max-w-3xl flex-col gap-6 px-4 sm:px-6">
        <h1 className="text-4xl leading-[1.05] font-extrabold tracking-tight text-white sm:text-6xl">
          La forma más simple de organizar tu viaje a{" "}
          <span className="text-fabpass-rosa">cualquier destino.</span>
        </h1>
        <p className="max-w-xl text-lg text-fabpass-celeste sm:text-xl">
          Planifica tus actividades, centraliza tus accesos y gestiona todo desde un solo lugar. Y además, puedes
          ahorrar hasta un <span className="font-bold text-white">43%</span> respecto a comprar cada experiencia por
          separado.
        </p>
        <button
          onClick={() => setModalAbierto(true)}
          className="flex min-h-[52px] w-full items-center justify-center gap-2 rounded-full bg-fabpass-rosa px-8 py-3 text-base font-bold text-white shadow-lg shadow-fabpass-rosa/30 transition-transform hover:scale-[1.02] sm:w-fit"
        >
          <MapPin size={18} />
          Elige tu destino
        </button>
      </div>

      {modalAbierto && (
        <SelectorDestinoModal ciudades={ciudades} locale={locale} onClose={() => setModalAbierto(false)} />
      )}
    </section>
  );
}
