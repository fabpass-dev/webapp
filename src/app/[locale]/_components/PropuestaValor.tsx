import { CalendarClock, Layers, MapPinned, Wallet } from "lucide-react";

const BLOQUES = [
  {
    icono: Layers,
    badge: "bg-fabpass-rosa/10",
    iconColor: "text-fabpass-rosa",
    titulo: "Demasiadas opciones, poco tiempo.",
    texto:
      "Comparar plataformas, leer reseñas, decidir qué vale la pena y qué no. FabPass filtra lo mejor por ti, para que solo te quede elegir lo que quieres vivir.",
  },
  {
    icono: CalendarClock,
    badge: "bg-fabpass-azul/10",
    iconColor: "text-fabpass-azul",
    titulo: "Reservas dispersas, confirmaciones por todos lados.",
    texto:
      "Un proveedor por cada actividad, un voucher por cada reserva. Con FabPass todo está en un solo lugar, accesible desde tu teléfono en cualquier momento.",
  },
  {
    icono: Wallet,
    badge: "bg-fabpass-dorado/15",
    iconColor: "text-fabpass-dorado",
    titulo: "El dinero, siempre una incógnita.",
    texto:
      "Cambio de moneda, efectivo, tarifas que varían. FabPass te permite pagar en tu moneda, de forma digital y con el precio claro desde el principio.",
  },
  {
    icono: MapPinned,
    badge: "bg-fabpass-medio/15",
    iconColor: "text-fabpass-medio",
    titulo: "Moverse por una ciudad nueva genera incertidumbre.",
    texto:
      "No saber si estás tomando las mejores decisiones es parte del estrés de viajar. FabPass te da información verificada y soporte local para que te muevas con confianza.",
  },
];

export function PropuestaValor() {
  return (
    <section className="bg-white px-4 py-16 sm:py-24">
      <div className="mx-auto max-w-5xl">
        <h2 className="text-center text-3xl font-extrabold tracking-tight text-fabpass-titulo sm:text-4xl">
          Todo lo que normalmente complica un viaje, resuelto.
        </h2>
        <p className="mx-auto mt-3 max-w-xl text-center text-fabpass-muted">
          FabPass existe para eliminar la fricción entre el turista y la ciudad que quiere descubrir.
        </p>
        <div className="mt-12 grid grid-cols-1 gap-5 sm:grid-cols-2">
          {BLOQUES.map((b) => (
            <div
              key={b.titulo}
              className="group rounded-2xl border border-fabpass-celeste bg-white p-6 shadow-[0_2px_16px_rgba(0,80,145,0.06)] transition-shadow hover:shadow-[0_8px_24px_rgba(0,80,145,0.12)]"
            >
              <div className={`mb-4 flex h-11 w-11 items-center justify-center rounded-xl ${b.badge}`}>
                <b.icono size={22} className={b.iconColor} />
              </div>
              <h3 className="font-bold text-fabpass-titulo">{b.titulo}</h3>
              <p className="mt-2 text-sm leading-relaxed text-fabpass-cuerpo">{b.texto}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
