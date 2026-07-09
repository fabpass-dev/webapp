create table public.liquidaciones (
  id uuid primary key default gen_random_uuid(),
  partner_id uuid references public.partners (id),
  empleado_id uuid references public.empleados (id),
  periodo_desde date not null,
  periodo_hasta date not null,
  monto_total numeric not null check (monto_total >= 0),
  pagado boolean not null default false,
  fecha_pago timestamptz,
  check (periodo_hasta >= periodo_desde),
  check (
    (partner_id is not null and empleado_id is null) or
    (partner_id is null and empleado_id is not null)
  )
);

create index liquidaciones_partner_id_idx on public.liquidaciones (partner_id);
create index liquidaciones_empleado_id_idx on public.liquidaciones (empleado_id);

alter table public.liquidaciones enable row level security;

create policy "liquidaciones_admin_de_partner_ve_las_propias"
  on public.liquidaciones for select
  using (
    partner_id is not null and exists (
      select 1 from public.empleados e
      where e.partner_id = liquidaciones.partner_id
        and e.auth_user_id = auth.uid()
        and e.rol = 'admin'
    )
  );

create policy "liquidaciones_empleado_ve_las_propias"
  on public.liquidaciones for select
  using (
    empleado_id is not null and exists (
      select 1 from public.empleados e
      where e.id = liquidaciones.empleado_id and e.auth_user_id = auth.uid()
    )
  );
