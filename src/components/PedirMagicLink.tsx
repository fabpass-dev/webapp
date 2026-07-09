"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";

export function PedirMagicLink() {
  const [email, setEmail] = useState("");
  const [enviado, setEnviado] = useState(false);

  async function enviar() {
    await createClient().auth.signInWithOtp({
      email,
      options: { emailRedirectTo: `${window.location.origin}/auth/callback` },
    });
    setEnviado(true);
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
      <button className="rounded bg-black text-white px-4 py-2" onClick={enviar} disabled={!email}>
        Mandarme el link
      </button>
    </div>
  );
}
