"use client";

import { useState } from "react";
import { SelectorDestinoModal } from "./SelectorDestinoModal";

export function Hero({ locale, ciudades }: { locale: string; ciudades: { nombre: string; slug: string }[] }) {
  const [modalAbierto, setModalAbierto] = useState(false);

  return (
    <section className="relative flex min-h-[80vh] items-center justify-center overflow-hidden bg-fabpass-profundo sm:min-h-[85vh]">
      <div
        className="absolute inset-0 bg-cover bg-center opacity-40"
        style={{
          backgroundImage:
            "linear-gradient(135deg, #1A2E4A 0%, #243B55 50%, #1A2E4A 100%)",
        }}
      />
      <div className="relative z-10 mx-auto flex max-w-2xl flex-col items-center gap-5 px-4 text-center">
        <h1 className="text-3xl font-bold text-white sm:text-[42px]">
          La forma más simple de organizar tu viaje a cualquier destino.
        </h1>
        <p className="text-base text-fabpass-celeste sm:text-xl">
          Planifica tus actividades, centraliza tus accesos y gestiona todo desde un solo lugar. Y además, puedes
          ahorrar hasta un 43% respecto a comprar cada experiencia por separado.
        </p>
        <button
          onClick={() => setModalAbierto(true)}
          className="min-h-[48px] w-full rounded-xl bg-fabpass-rosa px-8 py-3 font-semibold text-white sm:w-auto"
        >
          Elige tu destino
        </button>
      </div>

      {modalAbierto && (
        <SelectorDestinoModal ciudades={ciudades} locale={locale} onClose={() => setModalAbierto(false)} />
      )}
    </section>
  );
}
