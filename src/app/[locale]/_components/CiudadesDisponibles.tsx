import Link from "next/link";
import { ArrowRight, Landmark } from "lucide-react";

type Ciudad = { nombre: string; slug: string };

export function CiudadesDisponibles({ locale, ciudad }: { locale: string; ciudad: Ciudad | null }) {
  if (!ciudad) return null;

  return (
    <section className="bg-fabpass-celeste px-4 py-16 sm:py-24">
      <div className="mx-auto flex max-w-4xl flex-col gap-6 rounded-3xl bg-white p-6 shadow-xl shadow-fabpass-profundo/10 sm:flex-row sm:items-center sm:gap-10 sm:p-10">
        <div className="flex aspect-4/3 items-center justify-center rounded-2xl bg-gradient-to-br from-fabpass-profundo to-fabpass-azul shadow-lg sm:w-1/2">
          <Landmark size={56} className="text-white/90" strokeWidth={1.5} />
        </div>
        <div className="sm:w-1/2">
          <span className="inline-block rounded-full bg-fabpass-celeste-fondo px-3 py-1 text-xs font-bold text-fabpass-azul">
            Ciudad de lanzamiento
          </span>
          <h2 className="mt-3 text-3xl font-extrabold tracking-tight text-fabpass-azul">{ciudad.nombre}.</h2>
          <p className="mt-2 text-sm leading-relaxed text-fabpass-cuerpo">
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
            className="mt-5 inline-flex items-center gap-2 rounded-full bg-fabpass-rosa px-6 py-3 font-bold text-white shadow-md shadow-fabpass-rosa/25 transition-transform hover:scale-[1.02]"
          >
            Explorar {ciudad.nombre}
            <ArrowRight size={16} />
          </Link>
        </div>
      </div>
    </section>
  );
}
