import { Compass, ListChecks, QrCode } from "lucide-react";

const PASOS = [
  {
    numero: 1,
    icono: Compass,
    titulo: "Elige según tus intereses",
    texto:
      "Selecciona el tipo de experiencias que te interesan y los días que tienes disponibles. El sistema filtra las opciones más relevantes para tu perfil, sin listas infinitas ni decisiones abrumadoras.",
  },
  {
    numero: 2,
    icono: ListChecks,
    titulo: "Visualiza tu recorrido",
    texto:
      "En minutos obtienes una propuesta de itinerario. Puedes ajustarlo hasta que refleje exactamente lo que quieres vivir, con la logística ya resuelta.",
  },
  {
    numero: 3,
    icono: QrCode,
    titulo: "Accede a todo con un solo pase",
    texto:
      "Con tu itinerario listo, todas tus actividades quedan consolidadas en un único acceso digital. El sistema calcula automáticamente el formato de pase que mejor se adapta a tu plan, optimizando el costo total.",
  },
];

export function ComoFunciona() {
  return (
    <section className="bg-fabpass-celeste-fondo px-4 py-16 sm:py-24">
      <div className="mx-auto max-w-4xl">
        <h2 className="text-center text-3xl font-extrabold tracking-tight text-fabpass-titulo sm:text-4xl">
          Del deseo al itinerario en minutos.
        </h2>
        <p className="mt-3 text-center text-fabpass-muted">Tres pasos para tener tu viaje organizado antes de llegar.</p>
        <div className="mt-14 flex flex-col gap-10 sm:flex-row sm:gap-6">
          {PASOS.map((p) => (
            <div key={p.numero} className="flex flex-1 gap-4 sm:flex-col sm:items-center sm:gap-4 sm:text-center">
              <div className="relative flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-fabpass-azul to-fabpass-medio shadow-lg shadow-fabpass-azul/25">
                <p.icono size={24} className="text-white" />
                <span className="absolute -top-2 -right-2 flex h-6 w-6 items-center justify-center rounded-full bg-fabpass-rosa text-xs font-bold text-white shadow-sm">
                  {p.numero}
                </span>
              </div>
              <div>
                <h3 className="font-bold text-fabpass-titulo">{p.titulo}</h3>
                <p className="mt-1 text-sm leading-relaxed text-fabpass-cuerpo">{p.texto}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
