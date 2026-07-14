import { haversineKm } from "./haversine";

export type AtraccionPlan = {
  id: string;
  nombre: string;
  barrio: string | null;
  lat: number | null;
  lng: number | null;
  precio_mayor: number;
  gratuito: boolean;
  duracion_horas: number | null;
  horario_apertura: string | null;
};

export type ActividadDia = {
  atraccion: AtraccionPlan;
  orden: number;
  horario: string;
  distanciaSiguienteKm: number | null;
};

export type DiaItinerario = {
  numero: number;
  label: string;
  actividades: ActividadDia[];
};

const MAX_PAGAS_POR_DIA: Record<string, number> = { tranquilo: 2, moderado: 3, intenso: 3 };
const DIAS_SEMANA = ["domingo", "lunes", "martes", "miércoles", "jueves", "viernes", "sábado"];
const MESES = [
  "enero", "febrero", "marzo", "abril", "mayo", "junio",
  "julio", "agosto", "septiembre", "octubre", "noviembre", "diciembre",
];

function centroide(atracciones: AtraccionPlan[]): { lat: number; lng: number } {
  const conCoords = atracciones.filter((a) => a.lat != null && a.lng != null);
  if (conCoords.length === 0) return { lat: 0, lng: 0 };
  return {
    lat: conCoords.reduce((s, a) => s + (a.lat ?? 0), 0) / conCoords.length,
    lng: conCoords.reduce((s, a) => s + (a.lng ?? 0), 0) / conCoords.length,
  };
}

function ordenarBarriosPorProximidad(grupos: Map<string, AtraccionPlan[]>): string[] {
  const barrios = [...grupos.keys()];
  if (barrios.length <= 1) return barrios;

  const centroides = new Map(barrios.map((b) => [b, centroide(grupos.get(b)!)]));
  const restantes = new Set(barrios);
  const orden: string[] = [barrios[0]];
  restantes.delete(barrios[0]);

  while (restantes.size > 0) {
    const actual = centroides.get(orden[orden.length - 1])!;
    let masCercano = "";
    let menorDist = Infinity;
    for (const b of restantes) {
      const c = centroides.get(b)!;
      const d = haversineKm(actual.lat, actual.lng, c.lat, c.lng);
      if (d < menorDist) {
        menorDist = d;
        masCercano = b;
      }
    }
    orden.push(masCercano);
    restantes.delete(masCercano);
  }
  return orden;
}

function sumarHora(horaHHMM: string, minutos: number): string {
  const [h, m] = horaHHMM.split(":").map(Number);
  const total = h * 60 + m + minutos;
  const hh = Math.floor(total / 60) % 24;
  const mm = total % 60;
  return `${String(hh).padStart(2, "0")}:${String(mm).padStart(2, "0")}`;
}

// Cuántos días necesita REALMENTE el itinerario según lo elegido — puede no
// coincidir con los "días de turismo" del Paso 1 (eso era solo una intención
// inicial; una vez que se elige más o menos de lo que entra en esos días, el
// itinerario real manda). Se usa tanto para generar el resultado final como
// para que la recomendación de pase en el Paso 2 ya sea consistente con eso.
export function diasNecesarios(cantidadPagas: number, hayGratuitas: boolean, ritmo: "tranquilo" | "moderado" | "intenso"): number {
  const maxPorDia = MAX_PAGAS_POR_DIA[ritmo] ?? 3;
  if (cantidadPagas === 0) return hayGratuitas ? 1 : 0;
  return Math.ceil(cantidadPagas / maxPorDia);
}

export function generarItinerario(
  seleccionadas: AtraccionPlan[],
  ritmo: "tranquilo" | "moderado" | "intenso",
  fechaInicio: string | null,
): DiaItinerario[] {
  const pagas = seleccionadas.filter((a) => !a.gratuito);
  const gratuitas = seleccionadas.filter((a) => a.gratuito);
  const maxPorDia = MAX_PAGAS_POR_DIA[ritmo] ?? 3;

  const gruposBarrio = new Map<string, AtraccionPlan[]>();
  for (const a of pagas) {
    const key = a.barrio ?? "Sin barrio";
    gruposBarrio.set(key, [...(gruposBarrio.get(key) ?? []), a]);
  }
  const ordenBarrios = ordenarBarriosPorProximidad(gruposBarrio);
  const pagasOrdenadas = ordenBarrios.flatMap((b) => gruposBarrio.get(b) ?? []);

  const dias: AtraccionPlan[][] = [];
  for (let i = 0; i < pagasOrdenadas.length; i += maxPorDia) {
    dias.push(pagasOrdenadas.slice(i, i + maxPorDia));
  }
  if (dias.length === 0 && gratuitas.length > 0) dias.push([]);

  // Intercalar gratuitas de forma pareja entre los días, sin contar para el límite diario.
  gratuitas.forEach((g, i) => {
    const diaIdx = i % dias.length;
    dias[diaIdx].push(g);
  });

  return dias.map((actividadesDia, i) => {
    const ordenadas = [...actividadesDia].sort((a, b) =>
      (a.horario_apertura ?? "09:00").localeCompare(b.horario_apertura ?? "09:00"),
    );

    let horarioActual = "09:00";
    const actividades: ActividadDia[] = ordenadas.map((atraccion, idx) => {
      const horario = horarioActual;
      const duracionMin = (atraccion.duracion_horas ?? 1.5) * 60;
      horarioActual = sumarHora(horarioActual, duracionMin + 60);

      const siguiente = ordenadas[idx + 1];
      const distancia =
        siguiente && atraccion.lat != null && atraccion.lng != null && siguiente.lat != null && siguiente.lng != null
          ? haversineKm(atraccion.lat, atraccion.lng, siguiente.lat, siguiente.lng)
          : null;

      return { atraccion, orden: idx + 1, horario, distanciaSiguienteKm: distancia };
    });

    let label = `Día ${i + 1}`;
    if (fechaInicio) {
      const fecha = new Date(fechaInicio + "T00:00:00");
      fecha.setDate(fecha.getDate() + i);
      label = `Día ${i + 1} — ${DIAS_SEMANA[fecha.getDay()].replace(/^./, (c) => c.toUpperCase())} ${fecha.getDate()} de ${MESES[fecha.getMonth()]}`;
    }

    return { numero: i + 1, label, actividades };
  });
}
