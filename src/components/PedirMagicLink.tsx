"use client";

import { useState } from "react";
import { enviarMagicLink } from "@/lib/checkout/enviar-magic-link";

export function PedirMagicLink({ next }: { next?: string } = {}) {
  const [email, setEmail] = useState("");
  const [enviado, setEnviado] = useState(false);
  const [enviando, setEnviando] = useState(false);

  async function enviar() {
    setEnviando(true);
    await enviarMagicLink(email, next);
    setEnviado(true);
    setEnviando(false);
  }

  if (enviado) {
    return <p>Te mandamos un link a {email}. Abrilo desde este mismo navegador para entrar.</p>;
  }

  return (
    <div className="flex flex-col gap-2 max-w-sm">
      <label className="text-sm font-semibold">Ingresá tu email para ver tu pase</label>
      <input
        type="email"
        className="border rounded px-2 py-1"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <button
        className="rounded bg-black text-white px-4 py-2 disabled:opacity-50"
        onClick={enviar}
        disabled={!email || enviando}
      >
        {enviando ? "Enviando..." : "Mandarme el link"}
      </button>
    </div>
  );
}
