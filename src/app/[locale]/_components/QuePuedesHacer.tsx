const FRANJAS = [
  {
    titulo: "Lo que merece tu tiempo, ya seleccionado.",
    texto:
      "No todas las atracciones merecen tu tiempo. FabPass filtra lo mejor de cada destino — lo imprescindible y lo que la mayoría no llega a descubrir. Sin ruido, sin listas interminables.",
    imagenDerecha: false,
    placeholder: "Atracción icónica",
  },
  {
    titulo: "Un itinerario pensado para ti, no para todos.",
    texto:
      "Analizamos tus intereses y el tiempo real que tienes disponible para generarte el mejor recorrido posible. Combina atracciones de pago con los puntos emblemáticos gratuitos de la ciudad, optimizando cada momento de tu estadía.",
    imagenDerecha: true,
    placeholder: "Itinerario personalizado",
  },
  {
    titulo: "Experiencias que van más allá de lo convencional.",
    texto:
      "Si buscas algo fuera de lo común, FabPass tiene opciones para eso también. Vuelos panorámicos, días de polo, accesos preferenciales a experiencias exclusivas. Para quienes quieren que su viaje sea verdaderamente memorable.",
    imagenDerecha: false,
    placeholder: "Experiencia premium",
  },
  {
    titulo: "El ahorro ocurre solo, sin que tengas que calcularlo.",
    texto:
      "Al centralizar tu viaje en FabPass, el sistema determina automáticamente el formato que optimiza tu presupuesto. A eso se suma una red de beneficios en gastronomía, espectáculos, traslados y compras que reduce el costo de toda tu estadía.",
    imagenDerecha: true,
    placeholder: "Beneficios urbanos",
  },
];

function Placeholder({ texto }: { texto: string }) {
  return (
    <div className="flex aspect-4/3 w-full items-center justify-center rounded-xl bg-fabpass-celeste-fondo text-sm text-fabpass-muted">
      Imagen: {texto}
    </div>
  );
}

export function QuePuedesHacer() {
  return (
    <section className="bg-white px-4 py-16 sm:py-20">
      <div className="mx-auto max-w-4xl">
        <h2 className="text-center text-2xl font-bold text-fabpass-titulo sm:text-3xl">
          Tu tiempo es lo más valioso que tienes cuando viajas.
        </h2>
        <p className="mt-2 text-center text-fabpass-muted">
          FabPass entiende tu perfil y organiza la experiencia para que cada hora cuente.
        </p>
        <div className="mt-12 flex flex-col gap-12">
          {FRANJAS.map((f) => (
            <div
              key={f.titulo}
              className={`flex flex-col gap-6 sm:flex-row sm:items-center sm:gap-10 ${
                f.imagenDerecha ? "" : "sm:flex-row-reverse"
              }`}
            >
              <div className="sm:w-1/2">
                <Placeholder texto={f.placeholder} />
              </div>
              <div className="sm:w-1/2">
                <h3 className="text-lg font-bold text-fabpass-titulo">{f.titulo}</h3>
                <p className="mt-2 text-fabpass-cuerpo">{f.texto}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
