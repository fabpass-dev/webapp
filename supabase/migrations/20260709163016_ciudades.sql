create table public.ciudades (
  id uuid primary key default gen_random_uuid(),
  nombre text not null,
  slug text not null unique,
  pais text not null,
  moneda text not null,
  activa boolean not null default true,
  idioma_default text not null default 'es' check (idioma_default in ('es','en','pt','fr'))
);

alter table public.ciudades enable row level security;

-- Catálogo público: cualquiera puede leer las ciudades activas. Altas/bajas/ediciones
-- las hace el panel de admin con la clave secreta (service_role), que no pasa por RLS.
create policy "ciudades_lectura_publica"
  on public.ciudades for select
  to anon, authenticated
  using (activa = true);
