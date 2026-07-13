import Image from "next/image";
import Link from "next/link";

export function Footer({ locale }: { locale: string }) {
  return (
    <footer className="bg-fabpass-profundo px-4 py-12 text-[#CCCCCC] sm:px-6">
      <div className="mx-auto max-w-5xl">
        <Image src="/logo-fabpass-transparente.png" alt="FabPass" width={110} height={35} className="mb-8" />
        <div className="grid grid-cols-1 gap-8 sm:grid-cols-3">
          <div>
            <h3 className="mb-3 font-bold text-white">Producto</h3>
            <ul className="flex flex-col gap-2 text-sm">
              <li>
                <Link href={`/${locale}/buenosaires`}>Destinos (Buenos Aires)</Link>
              </li>
              <li>
                <Link href={`/${locale}/como-funciona`}>Cómo funciona</Link>
              </li>
              <li>
                <Link href={`/${locale}/buenosaires/beneficios`}>Beneficios y experiencias</Link>
              </li>
              <li>FabPass App</li>
            </ul>
          </div>
          <div>
            <h3 className="mb-3 font-bold text-white">Ayuda</h3>
            <ul className="flex flex-col gap-2 text-sm">
              <li>
                <Link href={`/${locale}/faqs`}>Preguntas frecuentes</Link>
              </li>
              <li>
                <Link href={`/${locale}/contacto`}>Contacto</Link>
              </li>
              <li>
                <Link href={`/${locale}/soporte`}>Soporte al viajero</Link>
              </li>
              <li>Instagram · TikTok · LinkedIn</li>
            </ul>
          </div>
          <div>
            <h3 className="mb-3 font-bold text-white">Institucional</h3>
            <ul className="flex flex-col gap-2 text-sm">
              <li>
                <Link href={`/${locale}/terminos`}>Términos y condiciones</Link>
              </li>
              <li>
                <Link href={`/${locale}/privacidad`}>Política de privacidad</Link>
              </li>
              <li>
                <Link href={`/${locale}/cookies`}>Política de cookies</Link>
              </li>
              <li>
                <Link href={`/${locale}/defensa-consumidor`}>Defensa del consumidor</Link>
              </li>
            </ul>
          </div>
        </div>
        <div className="mt-10 flex flex-col gap-1 border-t border-[#2E4A6E] pt-6 text-xs text-[#CCCCCC]">
          <p>© 2026 FabPass LLC. Todos los derechos reservados.</p>
          <p>Diseñado para optimizar tu tiempo y presupuesto en cada viaje.</p>
        </div>
      </div>
    </footer>
  );
}
