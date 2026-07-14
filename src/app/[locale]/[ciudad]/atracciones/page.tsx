import { createClient } from "@/lib/supabase/server";
import { CityNavbar } from "../_components/CityNavbar";
import { CitySubnav } from "../_components/CitySubnav";
import { CityFooter } from "../_components/CityFooter";
import { Buscador, FiltrosBar } from "./_components/FiltrosBar";
import { CarruselImperdibles } from "./_components/CarruselImperdibles";
import { AtraccionCard, type AtraccionCardData } from "./_components/AtraccionCard";
import { BloqueCTA } from "./_components/BloqueCTA";
import { PanelLateral } from "./_components/PanelLateral";
import { CapturaGuia } from "./_components/CapturaGuia";
import { tiposParaFiltro } from "@/lib/atracciones/tipo-pase";
import { CheckCircle2, Globe2, PiggyBank, Route, Smartphone, Ticket } from "lucide-react";

const MAS_FILTROS_CAMPO: Record<string, { campo: keyof AtraccionCardData | string; valor: boolean }> = {
  reserva: { campo: "requiere_reserva", valor: true },
  aire_libre: { campo: "al_aire_libre", valor: true },
  con_techo: { campo: "al_aire_libre", valor: false },
  familia: { campo: "apto_familia", valor: true },
  adultos: { campo: "solo_adultos", valor: true },
  gratuitas: { campo: "gratuito", valor: true },
};

export default async function AtraccionesPage({
  params,
  searchParams,
}: {
  params: Promise<{ locale: string; ciudad: string }>;
  searchParams: Promise<Record<string, string | undefined>>;
}) {
  const { locale, ciudad } = await params;
  const sp = await searchParams;
  const supabase = await createClient();
  const base = `/${locale}/${ciudad}`;

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

  const { data: ciudades } = await supabase.from("ciudades").select("nombre, slug").eq("activa", true).order("nombre");

  const { data: productos } = await supabase
    .from("productos")
    .select("tipo, precio_usd")
    .eq("ciudad_id", ciudadRow.id)
    .eq("activo", true)
    .order("precio_usd");
  const precioDays = productos?.find((p) => p.tipo === "fabdays")?.precio_usd ?? 0;
  const precioFlex = productos?.find((p) => p.tipo === "fabflex")?.precio_usd ?? 0;

  let query = supabase
    .from("atracciones")
    .select(
      "slug, nombre, tipo_pase, precio_mayor, descuento_porcentaje, gratuito, imperdible, requiere_reserva, rating, cantidad_reviews, categorias, al_aire_libre, apto_familia, solo_adultos",
    )
    .eq("ciudad_id", ciudadRow.id)
    .eq("activa", true);

  const tipoFiltro = sp.tipo || "todos";
  query = query.in("tipo_pase", tiposParaFiltro(tipoFiltro));

  if (sp.q) query = query.ilike("nombre", `%${sp.q}%`);

  const catsActivas = sp.cat ? sp.cat.split(",") : [];
  if (catsActivas.length > 0) query = query.overlaps("categorias", catsActivas);

  const masActivos = sp.mas ? sp.mas.split(",") : [];
  for (const m of masActivos) {
    const filtro = MAS_FILTROS_CAMPO[m];
    if (filtro) query = query.eq(filtro.campo, filtro.valor);
  }

  const orden = sp.orden || "populares";
  if (orden === "precio_desc") query = query.order("precio_mayor", { ascending: false });
  else if (orden === "precio_asc") query = query.order("precio_mayor", { ascending: true });
  else if (orden === "nombre") query = query.order("nombre", { ascending: true });
  else query = query.order("rating", { ascending: false, nullsFirst: false });

  const { data: atracciones } = await query;
  const lista = (atracciones ?? []) as AtraccionCardData[];

  const { count: totalActivas } = await supabase
    .from("atracciones")
    .select("*", { count: "exact", head: true })
    .eq("ciudad_id", ciudadRow.id)
    .eq("activa", true);

  // Entre 5 y 8 atracciones. Si hay menos de 5 marcadas como imperdibles,
  // se completa con el resto (por rating si hay, si no por relevancia) hasta
  // llegar a 5 — antes esto solo traía las marcadas, y con apenas 2 cargadas
  // el carrusel quedaba corto sin llenar el ancho.
  const CAMPOS_IMPERDIBLES =
    "slug, nombre, tipo_pase, precio_mayor, descuento_porcentaje, gratuito, imperdible, requiere_reserva, rating, cantidad_reviews";
  const { data: marcadasImperdibles } = await supabase
    .from("atracciones")
    .select(CAMPOS_IMPERDIBLES)
    .eq("ciudad_id", ciudadRow.id)
    .eq("activa", true)
    .eq("imperdible", true)
    .order("rating", { ascending: false, nullsFirst: false })
    .limit(8);

  let imperdibles = marcadasImperdibles ?? [];
  if (imperdibles.length < 5) {
    const { data: relleno } = await supabase
      .from("atracciones")
      .select(CAMPOS_IMPERDIBLES)
      .eq("ciudad_id", ciudadRow.id)
      .eq("activa", true)
      .eq("imperdible", false)
      .order("relevancia", { ascending: false, nullsFirst: false })
      .limit(8 - imperdibles.length);
    imperdibles = [...imperdibles, ...(relleno ?? [])];
  }

  // Bloques CTA intercalados cada 6 atracciones, rotando planificador → black → ahorro.
  const grupos: AtraccionCardData[][] = [];
  for (let i = 0; i < lista.length; i += 6) grupos.push(lista.slice(i, i + 6));
  const variantesCta = ["planificador", "black", "ahorro"] as const;

  return (
    <>
      <CityNavbar locale={locale} ciudadNombre={ciudadRow.nombre} ciudades={ciudades ?? []} />
      <CitySubnav locale={locale} ciudad={ciudad} activo="Atracciones" />

      <main className="flex-1 bg-white pb-24 lg:pb-0">
        <section className="bg-fabpass-celeste-fondo px-4 py-10 text-center sm:py-12">
          <h1 className="text-2xl font-bold text-fabpass-azul">{totalActivas ?? 0} atracciones en Buenos Aires</h1>
          <p className="mt-2 text-sm text-[#555555]">
            Teatros, museos, estadios, experiencias gastronómicas y mucho más — todo con un solo pase
          </p>
          <div className="mt-5">
            <Buscador />
          </div>
        </section>

        <CarruselImperdibles atracciones={(imperdibles ?? []) as AtraccionCardData[]} base={base} />

        <FiltrosBar />

        <div className="mx-auto max-w-6xl px-4 py-6 sm:px-6 lg:grid lg:grid-cols-[1fr_320px] lg:items-start lg:gap-8">
          <div className="min-w-0">
            <div className="flex items-center justify-between">
              <p className="text-sm text-fabpass-cuerpo">Mostrando {lista.length} atracciones</p>
            </div>

            {lista.length === 0 ? (
              <div className="mt-10 flex flex-col items-center gap-3 py-16 text-center">
                <p className="text-fabpass-cuerpo">No encontramos atracciones con esos filtros.</p>
                <a href={`${base}/atracciones`} className="rounded-full bg-fabpass-azul px-5 py-2 text-sm font-bold text-white">
                  Limpiar filtros
                </a>
              </div>
            ) : (
              <div className="mt-4 flex flex-col gap-6">
                {grupos.map((grupo, i) => (
                  <div key={i} className="grid grid-cols-2 gap-3 sm:grid-cols-2 lg:grid-cols-3">
                    {grupo.map((a) => (
                      <AtraccionCard key={a.slug} atraccion={a} base={base} />
                    ))}
                    {i < grupos.length - 1 && <BloqueCTA variante={variantesCta[i % 3]} base={base} />}
                  </div>
                ))}
              </div>
            )}
          </div>

          <PanelLateral base={base} precioDays={precioDays} precioFlex={precioFlex} />
        </div>

        <section className="bg-fabpass-celeste-fondo px-4 py-12 sm:px-6">
          <div className="mx-auto max-w-5xl">
            <h2 className="text-center text-xl font-bold text-fabpass-titulo">Por qué elegir FabPass</h2>
            <p className="mt-1 text-center text-sm text-fabpass-muted">Todo lo que necesitás para disfrutar Buenos Aires</p>
            <div className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-3">
              {[
                { icono: Ticket, t: "Un pase, todo incluido", d: "Sin filas, sin pagar en cada atracción. Mostrás el QR y entrás." },
                { icono: PiggyBank, t: "Ahorrás hasta 43%", d: "Vs. comprar cada atracción por separado al precio de ventanilla." },
                { icono: Route, t: "Itinerario personalizado", d: "El planificador organiza tu recorrido por barrios y horarios." },
                { icono: Smartphone, t: "Todo en tu teléfono", d: "QR en pantalla, sin imprimir nada. Funciona sin conexión." },
                { icono: CheckCircle2, t: "Cancelación gratuita", d: "Hasta 30 días desde la compra sin haber activado el pase." },
                { icono: Globe2, t: "En tu idioma", d: "Disponible en español, inglés y portugués." },
              ].map((b) => (
                <div key={b.t} className="rounded-xl bg-white p-4">
                  <b.icono size={20} className="text-fabpass-azul" />
                  <p className="mt-2 text-xs font-bold text-fabpass-titulo">{b.t}</p>
                  <p className="mt-1 text-[11px] text-fabpass-muted">{b.d}</p>
                </div>
              ))}
            </div>

            <div className="mt-8 flex flex-col items-start gap-3 rounded-2xl bg-fabpass-azul p-6 text-white sm:flex-row sm:items-center sm:justify-between">
              <p className="font-semibold">
                El planificador analiza las atracciones que querés ver y te dice cuál pase te conviene más
              </p>
              <a href={`${base}/planificador`} className="shrink-0 rounded-full bg-fabpass-rosa px-5 py-2.5 text-sm font-bold text-white">
                Planificar mi viaje gratis
              </a>
            </div>

            <div className="mt-8">
              <CapturaGuia />
            </div>
          </div>
        </section>
      </main>

      <CityFooter locale={locale} ciudad={ciudad} />
    </>
  );
}
