const BLOQUES = [
  {
    titulo: "Demasiadas opciones, poco tiempo.",
    texto:
      "Comparar plataformas, leer reseñas, decidir qué vale la pena y qué no. FabPass filtra lo mejor por ti, para que solo te quede elegir lo que quieres vivir.",
  },
  {
    titulo: "Reservas dispersas, confirmaciones por todos lados.",
    texto:
      "Un proveedor por cada actividad, un voucher por cada reserva. Con FabPass todo está en un solo lugar, accesible desde tu teléfono en cualquier momento.",
  },
  {
    titulo: "El dinero, siempre una incógnita.",
    texto:
      "Cambio de moneda, efectivo, tarifas que varían. FabPass te permite pagar en tu moneda, de forma digital y con el precio claro desde el principio.",
  },
  {
    titulo: "Moverse por una ciudad nueva genera incertidumbre.",
    texto:
      "No saber si estás tomando las mejores decisiones es parte del estrés de viajar. FabPass te da información verificada y soporte local para que te muevas con confianza.",
  },
];

export function PropuestaValor() {
  return (
    <section className="bg-white px-4 py-16 sm:py-20">
      <div className="mx-auto max-w-5xl">
        <h2 className="text-center text-2xl font-bold text-fabpass-titulo sm:text-3xl">
          Todo lo que normalmente complica un viaje, resuelto.
        </h2>
        <p className="mx-auto mt-2 max-w-xl text-center text-fabpass-muted">
          FabPass existe para eliminar la fricción entre el turista y la ciudad que quiere descubrir.
        </p>
        <div className="mt-10 grid grid-cols-1 gap-4 sm:grid-cols-2">
          {BLOQUES.map((b) => (
            <div key={b.titulo} className="rounded-xl border border-fabpass-celeste bg-[#F0F5FA] p-6">
              <h3 className="font-bold text-fabpass-titulo">{b.titulo}</h3>
              <p className="mt-2 text-sm text-fabpass-cuerpo">{b.texto}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
