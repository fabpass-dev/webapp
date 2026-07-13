"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export function ToggleActivoBoton({ endpoint, activo }: { endpoint: string; activo: boolean }) {
  const router = useRouter();
  const [enviando, setEnviando] = useState(false);

  async function alternar() {
    setEnviando(true);
    await fetch(endpoint, { method: "POST" });
    router.refresh();
    setEnviando(false);
  }

  return (
    <button className="text-sm underline disabled:opacity-50" onClick={alternar} disabled={enviando}>
      {enviando ? "..." : activo ? "Ocultar" : "Mostrar"}
    </button>
  );
}
