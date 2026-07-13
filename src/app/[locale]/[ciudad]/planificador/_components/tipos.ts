export type AtraccionPlanificador = {
  id: string;
  nombre: string;
  categorias: string[];
  barrio: string | null;
  lat: number | null;
  lng: number | null;
  precio_mayor: number;
  gratuito: boolean;
  duracion_horas: number | null;
  horario_apertura: string | null;
  horario_cierre: string | null;
  foto_url: string | null;
  descripcion: string | null;
};

export type Ritmo = "tranquilo" | "moderado" | "intenso";

export type ConfigViaje = {
  adultos: number;
  menores: number;
  diasTurismo: number;
  fechaInicio: string;
  ritmo: Ritmo;
};
