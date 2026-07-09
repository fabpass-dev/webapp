"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

type Producto = {
  id: string;
  nombre: string;
  variante: string;
  precio_usd: number;
  precio_menor_usd: number | null;
};

type Titular = { nombre: string; apellido: string; es_menor: boolean };

export default function CarritoPage() {
  const { locale, ciudad } = useParams<{ locale: string; ciudad: string }>();
  const searchParams = useSearchParams();
  const router = useRouter();
  const productoId = searchParams.get("producto");

  const [producto, setProducto] = useState<Producto | null>(null);
  const [email, setEmail] = useState("");
  const [gateway, setGateway] = useState<"mercadopago" | "stripe">("mercadopago");
  const [cuponCodigo, setCuponCodigo] = useState("");
  const [titulares, setTitulares] = useState<Titular[]>([{ nombre: "", apellido: "", es_menor: false }]);
  const [enviando, setEnviando] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!productoId) return;
    createClient()
      .from("productos")
      .select("id, nombre, variante, precio_usd, precio_menor_usd")
      .eq("id", productoId)
      .single()
      .then(({ data }) => setProducto(data));
  }, [productoId]);

  if (!productoId) {
    return (
      <main className="p-8">
        <p>
          Elegí un pase primero desde{" "}
          <a className="underline" href={`/${locale}/${ciudad}/productos`}>
            el catálogo
          </a>
          .
        </p>
      </main>
    );
  }

  const total = producto
    ? titulares.reduce(
        (acc, t) => acc + (t.es_menor ? producto.precio_menor_usd ?? producto.precio_usd : producto.precio_usd),
        0,
      )
    : 0;

  async function confirmarCompra() {
    setEnviando(true);
    setError(null);
    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          producto_id: productoId,
          email,
          gateway,
          cupon_codigo: cuponCodigo || undefined,
          titulares,
        }),
      });
      const data = await res.json();
      if (!data.ok) {
        setError(data.error ?? "error_desconocido");
        setEnviando(false);
        return;
      }
      sessionStorage.setItem("fabpass_confirmacion", JSON.stringify(data));
      router.push(`/${locale}/${ciudad}/carrito/confirmacion`);
    } catch {
      setError("error_de_red");
      setEnviando(false);
    }
  }

  return (
    <main className="p-8 max-w-xl mx-auto flex flex-col gap-6">
      <h1 className="text-2xl font-bold">Checkout {producto ? `— ${producto.nombre} ${producto.variante}` : ""}</h1>

      <section className="flex flex-col gap-3">
        <h2 className="font-semibold">Titulares (uno por pase)</h2>
        {titulares.map((t, i) => (
          <div key={i} className="border rounded p-3 flex flex-col gap-2">
            <div className="flex gap-2">
              <input
                className="border rounded px-2 py-1 flex-1"
                placeholder="Nombre"
                value={t.nombre}
                onChange={(e) => {
                  const copia = [...titulares];
                  copia[i] = { ...copia[i], nombre: e.target.value };
                  setTitulares(copia);
                }}
              />
              <input
                className="border rounded px-2 py-1 flex-1"
                placeholder="Apellido"
                value={t.apellido}
                onChange={(e) => {
                  const copia = [...titulares];
                  copia[i] = { ...copia[i], apellido: e.target.value };
                  setTitulares(copia);
                }}
              />
            </div>
            <label className="text-sm flex items-center gap-2">
              <input
                type="checkbox"
                checked={t.es_menor}
                onChange={(e) => {
                  const copia = [...titulares];
                  copia[i] = { ...copia[i], es_menor: e.target.checked };
                  setTitulares(copia);
                }}
              />
              Es menor
            </label>
            {titulares.length > 1 && (
              <button
                type="button"
                className="text-sm text-red-600 self-start"
                onClick={() => setTitulares(titulares.filter((_, idx) => idx !== i))}
              >
                Quitar
              </button>
            )}
          </div>
        ))}
        <button
          type="button"
          className="text-sm underline self-start"
          onClick={() => setTitulares([...titulares, { nombre: "", apellido: "", es_menor: false }])}
        >
          + Agregar otra persona
        </button>
      </section>

      <section className="flex flex-col gap-2">
        <label className="text-sm font-semibold">Email (para tu cuenta y el acceso a Mi FabPass)</label>
        <input
          type="email"
          className="border rounded px-2 py-1"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
      </section>

      <section className="flex flex-col gap-2">
        <label className="text-sm font-semibold">Cupón de descuento (opcional)</label>
        <input
          className="border rounded px-2 py-1"
          value={cuponCodigo}
          onChange={(e) => setCuponCodigo(e.target.value)}
        />
      </section>

      <section className="flex flex-col gap-2">
        <label className="text-sm font-semibold">Método de pago (simulado)</label>
        <div className="flex gap-4">
          <label className="flex items-center gap-1">
            <input
              type="radio"
              checked={gateway === "mercadopago"}
              onChange={() => setGateway("mercadopago")}
            />
            Mercado Pago
          </label>
          <label className="flex items-center gap-1">
            <input type="radio" checked={gateway === "stripe"} onChange={() => setGateway("stripe")} />
            Stripe
          </label>
        </div>
      </section>

      <p className="text-lg font-bold">Total: USD {total.toFixed(2)}</p>

      {error && <p className="text-red-600 text-sm">Error: {error}</p>}

      <button
        disabled={enviando || !email || titulares.some((t) => !t.nombre || !t.apellido)}
        onClick={confirmarCompra}
        className="rounded bg-black text-white px-4 py-3 disabled:opacity-50"
      >
        {enviando ? "Procesando..." : "Confirmar compra (simulada)"}
      </button>
    </main>
  );
}
