import { createClient } from "@/lib/supabase/server";
import { CityNavbar } from "../_components/CityNavbar";
import { CitySubnav } from "../_components/CitySubnav";
import { CityFooter } from "../_components/CityFooter";
import { PlanificadorWizard } from "./_components/PlanificadorWizard";

export default async function PlanificadorPage({ params }: { params: Promise<{ locale: string; ciudad: string }> }) {
  const { locale, ciudad } = await params;
  const supabase = await createClient();

  const { data: ciudadRow } = await supabase
    .from("ciudades")
    .select("id, nombre")
    .eq("slug", ciudad)
    .eq("activa", true)
    .maybeSingle();

  if (!ciudadRow) {
    return (
      <main className="p-8">
        <p>No encontramos la ciudad &quot;{ciudad}&quot;.</p>
      </main>
    );
  }

  const { data: ciudades } = await supabase.from("ciudades").select("nombre, slug").eq("activa", true).order("nombre");

  const { data: atracciones } = await supabase
    .from("atracciones")
    .select(
      "id, nombre, categorias, barrio, lat, lng, precio_mayor, gratuito, duracion_horas, horario_apertura, horario_cierre, foto_url",
    )
    .eq("ciudad_id", ciudadRow.id)
    .eq("activa", true)
    .in("tipo_pase", ["fabdays_fabflex", "fabflex"])
    .order("nombre");

  const { data: descripciones } = await supabase
    .from("atracciones_i18n")
    .select("atraccion_id, descripcion")
    .eq("idioma", "es");
  const descripcionPorId = new Map((descripciones ?? []).map((d) => [d.atraccion_id, d.descripcion]));

  const atraccionesConDescripcion = (atracciones ?? []).map((a) => ({
    ...a,
    descripcion: descripcionPorId.get(a.id) ?? null,
  }));

  const { data: productos } = await supabase
    .from("productos")
    .select("tipo, variante, precio_usd, validez_dias, max_atracciones_total")
    .eq("ciudad_id", ciudadRow.id)
    .eq("activo", true)
    .in("tipo", ["fabdays", "fabflex"]);

  return (
    <>
      <CityNavbar locale={locale} ciudadNombre={ciudadRow.nombre} ciudades={ciudades ?? []} />
      <CitySubnav locale={locale} ciudad={ciudad} activo="Planificador" />
      <main className="flex-1 bg-fabpass-fondo-claro">
        <PlanificadorWizard atracciones={atraccionesConDescripcion} productos={productos ?? []} base={`/${locale}/${ciudad}`} />
      </main>
      <CityFooter locale={locale} ciudad={ciudad} />
    </>
  );
}
