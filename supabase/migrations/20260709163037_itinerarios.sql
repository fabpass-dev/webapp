create table public.itinerarios (
  id uuid primary key default gen_random_uuid(),
  usuario_id uuid not null references public.usuarios (id),
  pase_id uuid references public.pases (id),
  nombre text,
  contenido jsonb not null default '{}'::jsonb,
  fecha_generacion timestamptz not null default now()
);

create index itinerarios_usuario_id_idx on public.itinerarios (usuario_id);

alter table public.itinerarios enable row level security;

-- Contenido generado por el propio turista (planificador determinístico, sin
-- IA) y sin dato sensible/financiero: se le permite CRUD completo sobre lo suyo.
create policy "itinerarios_turista_administra_los_propios"
  on public.itinerarios for all
  using (usuario_id = auth.uid())
  with check (usuario_id = auth.uid());
