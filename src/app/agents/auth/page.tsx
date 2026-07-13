"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

export default function AgentsAuthPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [enviando, setEnviando] = useState(false);

  async function entrar() {
    setEnviando(true);
    setError(null);
    const supabase = createClient();
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    if (error || !data.user) {
      setError("Email o contraseña incorrectos.");
      setEnviando(false);
      return;
    }

    const { data: empleado } = await supabase
      .from("agents_empleados")
      .select("id")
      .eq("auth_user_id", data.user.id)
      .maybeSingle();

    if (!empleado) {
      await supabase.auth.signOut();
      setError("Este login es solo para quienes venden pases (hotel, agencia, etc.). Las atracciones entran en /partners/auth.");
      setEnviando(false);
      return;
    }

    router.push("/agents");
    router.refresh();
  }

  return (
    <main className="p-8 max-w-sm mx-auto flex flex-col gap-4">
      <h1 className="text-2xl font-bold">Login Agents</h1>
      <p className="text-sm text-gray-500">Para hoteles, agencias y cualquiera que venda pases FabPass.</p>
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
