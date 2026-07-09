create table public.atracciones (
  id uuid primary key default gen_random_uuid(),
  ciudad_id uuid not null references public.ciudades (id),
  -- Vincula la atracción a su cuenta de partner (tipo = 'atraccion'), cuyos
  -- empleados son quienes escanean QR / ven liquidaciones. Nullable porque una
  -- atracción puede cargarse en el catálogo antes de tener cuenta propia.
  partner_id uuid references public.partners (id),
  nombre text not null,
  categoria text,
  barrio text,
  lat numeric,
  lng numeric,
  precio_mayor numeric not null check (precio_mayor >= 0),
  precio_menor numeric check (precio_menor >= 0),
  duracion_horas numeric check (duracion_horas > 0),
  requiere_reserva boolean not null default false,
  gratuito boolean not null default false,
  relevancia int check (relevancia between 1 and 10),
  imperdible boolean not null default false,
  mejor_momento text check (mejor_momento in ('mañana','tarde','noche')),
  apto_familia boolean not null default true,
  apto_lluvia boolean not null default false,
  horarios_apertura jsonb,
  activa boolean not null default true,
  comision_pct_default numeric not null default 0,
  comision_tipo text not null default 'porcentaje' check (comision_tipo in ('porcentaje','monto_fijo'))
);

create index atracciones_ciudad_id_idx on public.atracciones (ciudad_id);
create index atracciones_partner_id_idx on public.atracciones (partner_id);

alter table public.atracciones enable row level security;

create policy "atracciones_lectura_publica"
  on public.atracciones for select
  to anon, authenticated
  using (activa = true);

create policy "atracciones_visibles_para_su_propio_staff"
  on public.atracciones for select
  using (
    exists (
      select 1 from public.empleados e
      where e.partner_id = atracciones.partner_id and e.auth_user_id = auth.uid()
    )
  );

create table public.atracciones_i18n (
  id uuid primary key default gen_random_uuid(),
  atraccion_id uuid not null references public.atracciones (id) on delete cascade,
  idioma text not null check (idioma in ('es','en','pt','fr')),
  nombre text not null,
  descripcion text,
  unique (atraccion_id, idioma)
);

alter table public.atracciones_i18n enable row level security;

create policy "atracciones_i18n_lectura_publica"
  on public.atracciones_i18n for select
  to anon, authenticated
  using (true);
