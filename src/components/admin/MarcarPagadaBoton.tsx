"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export function MarcarPagadaBoton({ id }: { id: string }) {
  const router = useRouter();
  const [enviando, setEnviando] = useState(false);

  async function marcar() {
    setEnviando(true);
    await fetch(`/api/admin/liquidaciones/${id}/pagar`, { method: "POST" });
    router.refresh();
    setEnviando(false);
  }

  return (
    <button className="text-sm underline disabled:opacity-50" onClick={marcar} disabled={enviando}>
      {enviando ? "..." : "Marcar como pagada"}
    </button>
  );
}
