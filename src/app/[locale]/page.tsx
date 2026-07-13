import { createClient } from "@/lib/supabase/server";
import { Navbar } from "./_components/Navbar";
import { Hero } from "./_components/Hero";
import { PropuestaValor } from "./_components/PropuestaValor";
import { ComoFunciona } from "./_components/ComoFunciona";
import { QuePuedesHacer } from "./_components/QuePuedesHacer";
import { CiudadesDisponibles } from "./_components/CiudadesDisponibles";
import { PWAExplicacion } from "./_components/PWAExplicacion";
import { FAQsDerivacion } from "./_components/FAQsDerivacion";
import { Footer } from "./_components/Footer";

export default async function HomeInstitucional({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const supabase = await createClient();

  const { data: ciudades } = await supabase
    .from("ciudades")
    .select("nombre, slug")
    .eq("activa", true)
    .order("nombre");

  const listaCiudades = ciudades ?? [];

  return (
    <>
      <Navbar locale={locale} ciudades={listaCiudades} />
      <main className="flex-1">
        <Hero locale={locale} ciudades={listaCiudades} />
        {/* Social proof (S2): oculto hasta tener reseñas reales verificadas (Trustpilot). */}
        <PropuestaValor />
        <ComoFunciona />
        <QuePuedesHacer />
        <CiudadesDisponibles locale={locale} ciudad={listaCiudades[0] ?? null} />
        {/* Testimonios (S8): oculto hasta tener reseñas reales verificadas. */}
        <PWAExplicacion />
        <FAQsDerivacion locale={locale} />
      </main>
      <Footer locale={locale} />
    </>
  );
}
