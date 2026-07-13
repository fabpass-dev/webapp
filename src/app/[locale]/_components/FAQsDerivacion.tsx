import Link from "next/link";
import { HelpCircle, MessageCircleQuestion } from "lucide-react";

export function FAQsDerivacion({ locale }: { locale: string }) {
  return (
    <section className="bg-fabpass-fondo-claro px-4 py-16 sm:py-24">
      <div className="mx-auto max-w-4xl overflow-hidden rounded-3xl bg-gradient-to-br from-fabpass-azul to-fabpass-medio px-6 py-10 shadow-xl sm:px-12 sm:py-14">
        <div className="flex flex-col items-center gap-6 text-center sm:flex-row sm:items-center sm:gap-10 sm:text-left">
          <div className="flex h-24 w-24 shrink-0 items-center justify-center rounded-full bg-white/15 ring-4 ring-white/10">
            <MessageCircleQuestion size={44} className="text-white" strokeWidth={1.5} />
          </div>
          <div>
            <span className="inline-flex items-center gap-1 rounded-full bg-white/15 px-3 py-1 text-xs font-bold text-white">
              <HelpCircle size={12} /> Estamos para ayudarte
            </span>
            <h2 className="mt-3 text-2xl font-extrabold tracking-tight text-white sm:text-3xl">
              ¿Tienes alguna pregunta?
            </h2>
            <p className="mt-2 text-fabpass-celeste">
              Encontrarás respuestas rápidas sobre cómo funcionan los pases, cancelaciones, reembolsos y el uso de
              nuestra herramienta de planificación. Y si no encuentras lo que buscas, nuestro equipo está disponible
              para ayudarte.
            </p>
            <div className="mt-5 flex flex-col items-center gap-3 sm:flex-row">
              <Link
                href={`/${locale}/faqs`}
                className="rounded-full bg-white px-6 py-3 text-sm font-bold text-fabpass-azul shadow-md"
              >
                Ir a preguntas frecuentes
              </Link>
              <Link href={`/${locale}/contacto`} className="text-sm font-semibold text-white underline underline-offset-4">
                O contáctanos directamente
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
