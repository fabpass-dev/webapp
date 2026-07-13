export type ProductoVariante = { tipo: "fabdays" | "fabflex"; variante: string; precio_usd: number; validez_dias: number; max_atracciones_total: number | null };

// "3dias" -> "3 días" · "3atracciones" -> "3 atracciones"
export function formatVariante(variante: string): string {
  const match = variante.match(/^(\d+)(dia|dias|atraccion|atracciones)$/);
  if (!match) return variante;
  const [, num, unidad] = match;
  const unidadTexto = unidad.startsWith("dia") ? (num === "1" ? "día" : "días") : "atracciones";
  return `${num} ${unidadTexto}`;
}

export type Recomendacion = {
  fabdays: { variante: string; precio: number } | null;
  fabflex: { variante: string; precio: number } | null;
  recomendado: "fabdays" | "fabflex";
  ahorro: number;
};

// FabDays: variante mínima cuyos días cubren los días de turismo elegidos.
// FabFlex: variante mínima cuya cantidad de atracciones cubre las pagas elegidas.
// Ambos casos toman el precio real de `productos`, no un valor hardcodeado.
export function recomendarPase(
  productos: ProductoVariante[],
  diasTurismo: number,
  cantidadPagas: number,
  precioSinPase: number,
): Recomendacion {
  const dias = productos
    .filter((p) => p.tipo === "fabdays")
    .sort((a, b) => a.precio_usd - b.precio_usd);
  const flex = productos
    .filter((p) => p.tipo === "fabflex")
    .sort((a, b) => a.precio_usd - b.precio_usd);

  const variantePorDias = (v: string) => parseInt(v, 10) || 999;
  const varianteFabdays =
    dias.find((p) => variantePorDias(p.variante) >= diasTurismo) ?? dias[dias.length - 1] ?? null;
  const varianteFabflex =
    flex.find((p) => (p.max_atracciones_total ?? 999) >= cantidadPagas) ?? flex[flex.length - 1] ?? null;

  const fabdays = varianteFabdays ? { variante: varianteFabdays.variante, precio: varianteFabdays.precio_usd } : null;
  const fabflex = varianteFabflex ? { variante: varianteFabflex.variante, precio: varianteFabflex.precio_usd } : null;

  const precioDays = fabdays?.precio ?? Infinity;
  const precioFlex = fabflex?.precio ?? Infinity;
  const recomendado: "fabdays" | "fabflex" = precioFlex < precioDays ? "fabflex" : "fabdays";
  const precioRecomendado = recomendado === "fabdays" ? precioDays : precioFlex;

  return {
    fabdays,
    fabflex,
    recomendado,
    ahorro: Math.max(0, precioSinPase - (Number.isFinite(precioRecomendado) ? precioRecomendado : 0)),
  };
}
