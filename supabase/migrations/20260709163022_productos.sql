create table public.productos (
  id uuid primary key default gen_random_uuid(),
  ciudad_id uuid not null references public.ciudades (id),
  tipo text not null check (tipo in ('fabdays','fabflex','fabblack','fablife')),
  nombre text not null,
  variante text not null,
  precio_usd numeric not null check (precio_usd >= 0),
  precio_menor_usd numeric check (precio_menor_usd >= 0),
  max_atracciones_por_dia int check (max_atracciones_por_dia > 0),
  max_atracciones_total int check (max_atracciones_total > 0),
  validez_dias int not null check (validez_dias > 0),
  activo boolean not null default true
);

create index productos_ciudad_id_idx on public.productos (ciudad_id);

alter table public.productos enable row level security;

create policy "productos_lectura_publica"
  on public.productos for select
  to anon, authenticated
  using (activo = true);

create table public.productos_i18n (
  id uuid primary key default gen_random_uuid(),
  producto_id uuid not null references public.productos (id) on delete cascade,
  idioma text not null check (idioma in ('es','en','pt','fr')),
  nombre text not null,
  descripcion text,
  unique (producto_id, idioma)
);

alter table public.productos_i18n enable row level security;

create policy "productos_i18n_lectura_publica"
  on public.productos_i18n for select
  to anon, authenticated
  using (true);
