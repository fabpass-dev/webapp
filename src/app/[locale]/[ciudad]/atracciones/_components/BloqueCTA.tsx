import Link from "next/link";

const VARIANTES = {
  planificador: {
    bg: "bg-fabpass-celeste-fondo border border-[#B5D4F4]",
    titulo: "Armá tu itinerario gratis",
    texto: "Decinos cuántos días tenés y elegís las atracciones — nosotros te organizamos el recorrido día por día.",
    boton: "Ir al planificador",
    botonClase: "bg-fabpass-azul text-white",
    destino: "planificador",
  },
  black: {
    bg: "bg-fabpass-profundo text-white",
    titulo: "FabBlack — experiencias que no se consiguen solas",
    texto: "Polo, helicóptero, gastronomía privada y más — con descuento exclusivo para turistas FabPass.",
    boton: "Ver experiencias Black",
    botonClase: "bg-fabpass-rosa text-white",
    destino: "premium",
  },
  ahorro: {
    bg: "bg-[#E1F5EE] border border-[#9FE1CB]",
    titulo: "Ahorrás hasta 43% con FabPass",
    texto: "Comparás cuánto saldría comprar cada atracción por separado vs. con tu pase.",
    boton: "Ver comparador de ahorro",
    botonClase: "bg-fabpass-exito text-white",
    destino: "productos",
  },
} as const;

export function BloqueCTA({ variante, base }: { variante: keyof typeof VARIANTES; base: string }) {
  const v = VARIANTES[variante];
  return (
    <div className={`col-span-full flex flex-col items-start gap-3 rounded-2xl p-6 sm:flex-row sm:items-center sm:justify-between ${v.bg}`}>
      <div>
        <p className="font-bold">{v.titulo}</p>
        <p className={`mt-1 text-sm ${variante === "black" ? "text-white/80" : "text-fabpass-cuerpo"}`}>{v.texto}</p>
      </div>
      <Link href={`${base}/${v.destino}`} className={`shrink-0 rounded-full px-5 py-2.5 text-sm font-bold ${v.botonClase}`}>
        {v.boton}
      </Link>
    </div>
  );
}
