const PASOS = [
  {
    numero: 1,
    titulo: "Elige según tus intereses",
    texto:
      "Selecciona el tipo de experiencias que te interesan y los días que tienes disponibles. El sistema filtra las opciones más relevantes para tu perfil, sin listas infinitas ni decisiones abrumadoras.",
  },
  {
    numero: 2,
    titulo: "Visualiza tu recorrido",
    texto:
      "En minutos obtienes una propuesta de itinerario. Puedes ajustarlo hasta que refleje exactamente lo que quieres vivir, con la logística ya resuelta.",
  },
  {
    numero: 3,
    titulo: "Accede a todo con un solo pase",
    texto:
      "Con tu itinerario listo, todas tus actividades quedan consolidadas en un único acceso digital. El sistema calcula automáticamente el formato de pase que mejor se adapta a tu plan, optimizando el costo total.",
  },
];

export function ComoFunciona() {
  return (
    <section className="bg-fabpass-celeste-fondo px-4 py-16 sm:py-20">
      <div className="mx-auto max-w-4xl">
        <h2 className="text-center text-2xl font-bold text-fabpass-titulo sm:text-3xl">
          Del deseo al itinerario en minutos.
        </h2>
        <p className="mt-2 text-center text-fabpass-muted">Tres pasos para tener tu viaje organizado antes de llegar.</p>
        <div className="mt-10 flex flex-col gap-8 sm:flex-row sm:gap-6">
          {PASOS.map((p) => (
            <div key={p.numero} className="flex flex-1 gap-4 sm:flex-col sm:gap-3 sm:text-center">
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-fabpass-azul text-sm font-bold text-white sm:mx-auto">
                {p.numero}
              </div>
              <div>
                <h3 className="font-bold text-fabpass-titulo">{p.titulo}</h3>
                <p className="mt-1 text-sm text-fabpass-cuerpo">{p.texto}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
