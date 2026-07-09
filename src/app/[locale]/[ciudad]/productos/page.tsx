import Link from "next/link";
import { createClient } from "@/lib/supabase/server";

export default async function ProductosPage({
  params,
}: {
  params: Promise<{ locale: string; ciudad: string }>;
}) {
  const { locale, ciudad } = await params;
  const supabase = await createClient();

  const { data: ciudadRow } = await supabase
    .from("ciudades")
    .select("id, nombre")
    .eq("slug", ciudad)
    .eq("activa", true)
    .maybeSingle();

  if (!ciudadRow) {
    return (
      <main className="p-8">
        <p>No encontramos la ciudad &quot;{ciudad}&quot;.</p>
      </main>
    );
  }

  const { data: productos } = await supabase
    .from("productos")
    .select("id, tipo, nombre, variante, precio_usd, precio_menor_usd, validez_dias")
    .eq("ciudad_id", ciudadRow.id)
    .eq("activo", true)
    .order("tipo")
    .order("precio_usd");

  return (
    <main className="p-8 max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Elegí tu pase — {ciudadRow.nombre}</h1>
      <ul className="flex flex-col gap-3">
        {productos?.map((p) => (
          <li key={p.id} className="border rounded-lg p-4 flex items-center justify-between">
            <div>
              <p className="font-semibold">
                {p.nombre} — {p.variante}
              </p>
              <p className="text-sm text-gray-500">
                USD {p.precio_usd} (adulto){p.precio_menor_usd ? ` · USD ${p.precio_menor_usd} (menor)` : ""} ·
                válido {p.validez_dias} días desde la activación
              </p>
            </div>
            <Link
              href={`/${locale}/${ciudad}/carrito?producto=${p.id}`}
              className="rounded bg-black text-white px-4 py-2 text-sm shrink-0"
            >
              Comprar
            </Link>
          </li>
        ))}
      </ul>
    </main>
  );
}
