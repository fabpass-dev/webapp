"use client";

import { useState } from "react";

export function CapturaGuia() {
  const [email, setEmail] = useState("");
  const [enviando, setEnviando] = useState(false);
  const [mensaje, setMensaje] = useState<string | null>(null);

  async function enviar() {
    setEnviando(true);
    const res = await fetch("/api/leads", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, source: "guia_atracciones" }),
    });
    const data = await res.json();
    if (!data.ok) {
      setMensaje("No pudimos guardar tu email. Probá de nuevo.");
    } else if (data.yaExistia) {
      setMensaje("Ya te enviamos la guía a ese email.");
    } else {
      setMensaje("Te enviamos la guía a tu email.");
    }
    setEnviando(false);
  }

  return (
    <div className="rounded-2xl border border-fabpass-celeste bg-white p-6 sm:flex sm:items-center sm:justify-between sm:gap-8">
      <div>
        <p className="font-bold text-fabpass-titulo">Descargá la guía gratuita de Buenos Aires</p>
        <p className="mt-1 text-sm text-fabpass-muted">
          Barrios, tips locales, transporte, gastronomía y los mejores momentos para visitar cada atracción.
        </p>
      </div>
      <div className="mt-4 flex flex-col gap-2 sm:mt-0 sm:w-80 sm:shrink-0">
        {mensaje ? (
          <p className="text-sm font-semibold text-fabpass-azul">{mensaje}</p>
        ) : (
          <div className="flex gap-2">
            <input
              type="email"
              placeholder="tu@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="flex-1 rounded-full border border-fabpass-celeste px-4 py-2 text-sm outline-none"
            />
            <button
              onClick={enviar}
              disabled={enviando || !email.includes("@")}
              className="shrink-0 rounded-full bg-fabpass-azul px-4 py-2 text-sm font-bold text-white disabled:opacity-50"
            >
              {enviando ? "..." : "Quiero la guía"}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
