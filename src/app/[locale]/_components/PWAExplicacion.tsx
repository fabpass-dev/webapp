import Image from "next/image";

export function PWAExplicacion() {
  return (
    <section className="bg-fabpass-azul px-4 py-16 sm:py-20">
      <div className="mx-auto flex max-w-4xl flex-col gap-8 sm:flex-row sm:items-center sm:gap-12">
        <div className="flex aspect-square items-center justify-center rounded-xl bg-white/10 sm:w-1/2">
          <Image src="/logo-fabpass-transparente.png" alt="FabPass" width={160} height={50} className="opacity-90" />
        </div>
        <div className="sm:w-1/2">
          <h2 className="text-2xl font-bold text-white sm:text-3xl">
            FabPass siempre contigo. Sin descargas, sin complicaciones.
          </h2>
          <p className="mt-3 text-fabpass-celeste">
            FabPass utiliza tecnología PWA — una aplicación que vive en tu navegador pero se comporta exactamente
            como una app nativa. Sin pasar por tiendas de aplicaciones, sin ocupar espacio en tu teléfono.
          </p>
          <p className="mt-3 text-fabpass-celeste">
            Agrégala a tu pantalla de inicio en tres pasos y tendrás acceso instantáneo a tu itinerario, tus tickets
            y tus mapas — incluso sin conexión a internet.
          </p>
          <ol className="mt-4 flex flex-col gap-1 text-sm text-white">
            <li>1. Abre el link de FabPass desde tu navegador</li>
            <li>2. Toca &quot;Compartir&quot; o el menú de opciones de tu navegador</li>
            <li>3. Selecciona &quot;Agregar a pantalla de inicio&quot;</li>
          </ol>
        </div>
      </div>
    </section>
  );
}
