import Link from "next/link";
import { CalendarCheck, Star } from "lucide-react";
import { TIPO_PASE_INFO } from "@/lib/atracciones/tipo-pase";

export type AtraccionCardData = {
  slug: string;
  nombre: string;
  tipo_pase: string;
  precio_mayor: number;
  descuento_porcentaje: number | null;
  gratuito: boolean;
  imperdible: boolean;
  requiere_reserva: boolean;
  rating: number | null;
  cantidad_reviews: number;
};

function precioTexto(a: AtraccionCardData) {
  if (a.gratuito) return null;
  if (a.tipo_pase === "fablife") return `Precio carta · ${a.descuento_porcentaje ?? 0}% off`;
  if (a.tipo_pase === "fabblack") return `Sin descuento: USD ${a.precio_mayor}`;
  return `Sin pase: USD ${a.precio_mayor}`;
}

export function AtraccionCard({ atraccion, base }: { atraccion: AtraccionCardData; base: string }) {
  const tipo = TIPO_PASE_INFO[atraccion.tipo_pase];
  const precio = precioTexto(atraccion);

  return (
    <Link
      href={`${base}/atracciones/${atraccion.slug}`}
      className="group overflow-hidden rounded-xl border border-fabpass-celeste bg-white shadow-sm transition-shadow hover:shadow-md"
    >
      <div className="relative flex aspect-video items-center justify-center bg-gradient-to-br from-fabpass-azul to-fabpass-medio">
        <span className={`absolute top-2 left-2 rounded px-2 py-0.5 text-[10px] font-bold ${tipo.bg} ${tipo.text}`}>
          {tipo.label}
        </span>
        {atraccion.imperdible && (
          <span className="absolute top-2 right-2 rounded bg-[#FAEEDA] px-2 py-0.5 text-[10px] font-bold text-[#633806]">
            Imperdible
          </span>
        )}
        <span className="text-2xl font-bold text-white/30">{atraccion.nombre.slice(0, 1)}</span>
      </div>
      <div className="p-3">
        <p className="line-clamp-2 text-[13px] font-bold text-fabpass-titulo">{atraccion.nombre}</p>
        {atraccion.rating && atraccion.cantidad_reviews > 0 && (
          <p className="mt-1 flex items-center gap-1 text-xs text-fabpass-cuerpo">
            <Star size={12} className="fill-[#F5A623] text-[#F5A623]" />
            {atraccion.rating.toFixed(1)}
            <span className="text-fabpass-muted">({atraccion.cantidad_reviews})</span>
          </p>
        )}
        {atraccion.gratuito ? (
          <p className="mt-1 text-xs font-semibold text-fabpass-exito">Gratuita</p>
        ) : (
          precio && <p className="mt-1 text-[11px] text-[#888888] line-through decoration-[#AAAAAA]">{precio}</p>
        )}
        {atraccion.requiere_reserva && (
          <span className="mt-1 inline-block rounded bg-[#FAEEDA] px-1.5 py-0.5 text-[10px] font-semibold text-[#854F0B]">
            <CalendarCheck size={10} className="mr-1 inline" />
            Requiere reserva
          </span>
        )}
      </div>
    </Link>
  );
}
