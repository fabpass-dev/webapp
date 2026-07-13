import Link from "next/link";

const LINKS = [
  { href: "", label: "Buenos Aires" },
  { href: "/atracciones", label: "Atracciones" },
  { href: "/como-funciona", label: "Cómo funciona" },
  { href: "/planificador", label: "Planificador" },
  { href: "/faqs", label: "FAQs" },
];

export function CitySubnav({ locale, ciudad, activo }: { locale: string; ciudad: string; activo: string }) {
  const base = `/${locale}/${ciudad}`;

  return (
    <div className="sticky top-16 z-30 flex items-center justify-between bg-fabpass-profundo px-4 py-2 sm:px-6">
      <div className="flex items-center gap-4 overflow-x-auto text-sm">
        {LINKS.map((l) => (
          <Link
            key={l.label}
            href={`${base}${l.href}`}
            className={`shrink-0 whitespace-nowrap ${
              activo === l.label ? "font-semibold text-white" : "text-white/70 hover:text-white"
            }`}
          >
            {l.label}
          </Link>
        ))}
      </div>
      <Link
        href={`${base}/productos`}
        className="ml-4 shrink-0 rounded-full bg-fabpass-rosa px-4 py-1.5 text-sm font-bold text-white"
      >
        Comprar
      </Link>
    </div>
  );
}
