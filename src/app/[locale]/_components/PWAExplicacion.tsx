import Image from "next/image";
import { Share, Smartphone, SquarePlus } from "lucide-react";

const PASOS = [
  { icono: Share, texto: "Abre el link de FabPass desde tu navegador" },
  { icono: SquarePlus, texto: 'Toca "Compartir" o el menú de opciones de tu navegador' },
  { icono: Smartphone, texto: 'Selecciona "Agregar a pantalla de inicio"' },
];

export function PWAExplicacion() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-fabpass-azul via-[#0A5FA8] to-fabpass-profundo px-4 py-16 sm:py-24">
      <div className="pointer-events-none absolute -bottom-24 -left-24 h-72 w-72 rounded-full bg-white/5 blur-3xl" />
      <div className="mx-auto flex max-w-4xl flex-col-reverse gap-10 sm:flex-row sm:items-center sm:gap-16">
        <div className="flex justify-center sm:w-2/5">
          {/* Mockup de teléfono con un QR real (código de demostración) */}
          <div className="w-56 rotate-3 rounded-[2.5rem] border-[6px] border-fabpass-profundo bg-fabpass-profundo p-2 shadow-2xl">
            <div className="flex flex-col items-center gap-4 rounded-[1.75rem] bg-gradient-to-b from-fabpass-azul to-fabpass-profundo px-4 py-8">
              <Image src="/logo-fabpass-transparente.png" alt="FabPass" width={90} height={28} className="brightness-0 invert" />
              <div className="rounded-xl bg-white p-2">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src="/api/qr?data=DEMO.FABPASS" alt="Código QR de ejemplo" width={110} height={110} />
              </div>
              <p className="text-[10px] tracking-wide text-fabpass-celeste">FP-2026-00000 · DEMO</p>
            </div>
          </div>
        </div>
        <div className="sm:w-3/5">
          <span className="inline-block rounded-full bg-white/10 px-3 py-1 text-xs font-bold text-white">
            Tecnología sin esperas
          </span>
          <h2 className="mt-3 text-3xl font-extrabold tracking-tight text-white sm:text-4xl">
            FabPass en tu bolsillo. Sin descargas, sin complicaciones.
          </h2>
          <p className="mt-3 text-fabpass-celeste">
            FabPass utiliza tecnología PWA — una aplicación que vive en tu navegador pero se comporta exactamente
            como una app nativa. Sin pasar por tiendas de aplicaciones, sin ocupar espacio en tu teléfono.
          </p>
          <p className="mt-3 text-fabpass-celeste">
            Agrégala a tu pantalla de inicio en tres pasos y tendrás acceso instantáneo a tu itinerario, tus tickets
            y tus mapas — incluso sin conexión a internet.
          </p>
          <ol className="mt-6 flex flex-col gap-3">
            {PASOS.map((p, i) => (
              <li key={i} className="flex items-center gap-3 text-sm text-white">
                <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-white/15">
                  <p.icono size={15} />
                </span>
                {p.texto}
              </li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
}
