import Link from "next/link";

type Ciudad = { nombre: string; slug: string };

export function CiudadesDisponibles({ locale, ciudad }: { locale: string; ciudad: Ciudad | null }) {
  if (!ciudad) return null;

  return (
    <section className="bg-fabpass-celeste px-4 py-16 sm:py-20">
      <div className="mx-auto flex max-w-4xl flex-col gap-6 rounded-2xl bg-white p-6 sm:flex-row sm:items-center sm:gap-10 sm:p-10">
        <div className="flex aspect-4/3 items-center justify-center rounded-xl bg-fabpass-celeste-fondo text-sm text-fabpass-muted sm:w-1/2">
          Imagen: {ciudad.nombre}
        </div>
        <div className="sm:w-1/2">
          <span className="inline-block rounded-full bg-fabpass-celeste-fondo px-3 py-1 text-xs font-bold text-fabpass-azul">
            Ciudad de lanzamiento
          </span>
          <h2 className="mt-3 text-2xl font-bold text-fabpass-azul sm:text-3xl">{ciudad.nombre}.</h2>
          <p className="mt-2 text-sm text-fabpass-cuerpo">
            La capital cultural de América Latina, con toda la organización de FabPass. Desde sus teatros e
            instituciones históricas hasta su gastronomía, diseño y vida nocturna. Un itinerario que combina los
            lugares que no pueden faltar con los que pocos turistas llegan a conocer.
          </p>
          <ul className="mt-4 flex flex-col gap-1 text-sm text-fabpass-cuerpo">
            <li>Más de 25 atracciones seleccionadas</li>
            <li>Acceso a beneficios en gastronomía, espectáculos y servicios</li>
            <li>Experiencias exclusivas disponibles como upgrade</li>
          </ul>
          <Link
            href={`/${locale}/${ciudad.slug}`}
            className="mt-5 inline-block rounded-xl bg-fabpass-rosa px-6 py-3 font-semibold text-white"
          >
            Explorar {ciudad.nombre}
          </Link>
        </div>
      </div>
    </section>
  );
}
