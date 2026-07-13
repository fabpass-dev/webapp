// Pastilla de tipo de pase — misma paleta en el catálogo y en el
// planificador (ver FabPass_Atracciones.docx, "Pastillas de tipo de pase").
export const TIPO_PASE_INFO: Record<string, { label: string; bg: string; text: string }> = {
  fabdays_fabflex: { label: "FabDays · FabFlex", bg: "bg-fabpass-azul", text: "text-white" },
  fabflex: { label: "FabFlex", bg: "bg-[#4A7CC7]", text: "text-white" },
  fabblack: { label: "FabBlack", bg: "bg-[#222222]", text: "text-white" },
  fablife: { label: "FabLife", bg: "bg-[#1D9E75]", text: "text-white" },
};

// FabDays muestra fabdays_fabflex. FabFlex muestra fabdays_fabflex Y fabflex.
// FabBlack y FabLife muestran solo lo suyo.
export function tiposParaFiltro(filtro: string): string[] {
  if (filtro === "fabdays") return ["fabdays_fabflex"];
  if (filtro === "fabflex") return ["fabdays_fabflex", "fabflex"];
  if (filtro === "fabblack") return ["fabblack"];
  if (filtro === "fablife") return ["fablife"];
  return ["fabdays_fabflex", "fabflex", "fabblack", "fablife"];
}
