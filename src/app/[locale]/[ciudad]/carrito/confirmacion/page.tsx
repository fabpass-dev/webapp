"use client";

import { useEffect, useState } from "react";

type Confirmacion = {
  transaccion_id: string;
  pases: { id: string; codigo_alfanumerico: string; titular_nombre: string; titular_apellido: string }[];
};

export default function ConfirmacionPage() {
  const [datos, setDatos] = useState<Confirmacion | null>(null);
  const [noEncontrado, setNoEncontrado] = useState(false);

  useEffect(() => {
    const guardado = sessionStorage.getItem("fabpass_confirmacion");
    if (guardado) {
      setDatos(JSON.parse(guardado));
    } else {
      setNoEncontrado(true);
    }
  }, []);

  if (noEncontrado) {
    return (
      <main className="p-8 max-w-xl mx-auto flex flex-col gap-4">
        <h1 className="text-2xl font-bold">¿No recibiste el detalle de tu compra?</h1>
        <p>Revisá tu email — ahí te llegó un link para entrar a &quot;Mi FabPass&quot; sin contraseña.</p>
        <button className="rounded border px-4 py-2 self-start">No recibí mi pase</button>
      </main>
    );
  }

  if (!datos) return null;

  return (
    <main className="p-8 max-w-xl mx-auto flex flex-col gap-4">
      <h1 className="text-2xl font-bold">¡Compra confirmada! 🎉</h1>
      <p>Te enviamos un email con un link mágico para entrar a &quot;Mi FabPass&quot; sin necesidad de contraseña.</p>
      <ul className="flex flex-col gap-2">
        {datos.pases.map((p) => (
          <li key={p.id} className="border rounded p-3">
            <p className="font-semibold">
              {p.titular_nombre} {p.titular_apellido}
            </p>
            <p className="text-sm text-gray-500">Código: {p.codigo_alfanumerico}</p>
          </li>
        ))}
      </ul>
      <button className="rounded border px-4 py-2 self-start">No recibí mi pase</button>
    </main>
  );
}
