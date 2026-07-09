create table public.reservas (
  id uuid primary key default gen_random_uuid(),
  atraccion_id uuid not null references public.atracciones (id),
  pase_id uuid not null references public.pases (id),
  fecha date not null,
  hora text not null,
  estado text not null default 'pendiente' check (estado in ('pendiente','confirmada','cancelada'))
);

create index reservas_atraccion_id_idx on public.reservas (atraccion_id);
create index reservas_pase_id_idx on public.reservas (pase_id);

alter table public.reservas enable row level security;

create policy "reservas_turista_ve_las_de_sus_pases"
  on public.reservas for select
  using (
    exists (select 1 from public.pases p where p.id = reservas.pase_id and p.usuario_id = auth.uid())
  );

create policy "reservas_turista_crea_para_sus_pases"
  on public.reservas for insert
  with check (
    exists (select 1 from public.pases p where p.id = reservas.pase_id and p.usuario_id = auth.uid())
  );

create policy "reservas_staff_de_la_atraccion_ve_las_suyas"
  on public.reservas for select
  using (
    exists (
      select 1 from public.empleados e
      join public.atracciones a on a.partner_id = e.partner_id
      where a.id = reservas.atraccion_id and e.auth_user_id = auth.uid()
    )
  );
