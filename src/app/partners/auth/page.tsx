"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

export default function PartnersAuthPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [enviando, setEnviando] = useState(false);

  async function entrar() {
    setEnviando(true);
    setError(null);
    const { error } = await createClient().auth.signInWithPassword({ email, password });
    if (error) {
      setError("Email o contraseña incorrectos.");
      setEnviando(false);
      return;
    }
    router.push("/partners/validar");
    router.refresh();
  }

  return (
    <main className="p-8 max-w-sm mx-auto flex flex-col gap-4">
      <h1 className="text-2xl font-bold">Login Partners</h1>
      <input
        type="email"
        placeholder="Email"
        className="border rounded px-2 py-1"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <input
        type="password"
        placeholder="Contraseña"
        className="border rounded px-2 py-1"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      {error && <p className="text-red-600 text-sm">{error}</p>}
      <button
        className="rounded bg-black text-white px-4 py-2 disabled:opacity-50"
        onClick={entrar}
        disabled={enviando || !email || !password}
      >
        {enviando ? "Entrando..." : "Entrar"}
      </button>
    </main>
  );
}
