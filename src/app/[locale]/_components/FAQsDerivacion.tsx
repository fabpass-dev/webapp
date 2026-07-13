import Link from "next/link";

export function FAQsDerivacion({ locale }: { locale: string }) {
  return (
    <section className="bg-fabpass-fondo-claro px-4 py-16 sm:py-20">
      <div className="mx-auto flex max-w-4xl flex-col gap-8 sm:flex-row sm:items-center sm:gap-12">
        <div className="flex aspect-4/3 items-center justify-center rounded-xl bg-fabpass-celeste-fondo text-sm text-fabpass-muted sm:w-1/2">
          Imagen: turista consultando el teléfono
        </div>
        <div className="sm:w-1/2">
          <h2 className="text-2xl font-bold text-fabpass-titulo sm:text-3xl">¿Tienes alguna pregunta?</h2>
          <p className="mt-3 text-fabpass-cuerpo">
            Encontrarás respuestas rápidas sobre cómo funcionan los pases, cancelaciones, reembolsos y el uso de
            nuestra herramienta de planificación. Y si no encuentras lo que buscas, nuestro equipo está disponible
            para ayudarte.
          </p>
          <div className="mt-5 flex flex-col items-start gap-3">
            <Link
              href={`/${locale}/faqs`}
              className="rounded-xl border-2 border-fabpass-azul px-6 py-3 font-semibold text-fabpass-azul"
            >
              Ir a preguntas frecuentes
            </Link>
            <Link href={`/${locale}/contacto`} className="text-sm font-semibold text-fabpass-rosa">
              O contáctanos directamente
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
