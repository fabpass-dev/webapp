create table public.usos (
  id uuid primary key default gen_random_uuid(),
  pase_id uuid not null references public.pases (id),
  atraccion_id uuid not null references public.atracciones (id),
  fecha_hora timestamptz not null default now(),
  comision_pct_aplicada numeric not null,
  monto_a_liquidar numeric not null,
  -- El personal de atracciones ahora también son `empleados` (de un partner
  -- tipo 'atraccion'), así que esta referencia ya no necesita ser polimórfica.
  validado_por uuid not null references public.empleados (id),
  -- Nunca se borra un uso: se anula con motivo, para dejar rastro auditable.
  estado text not null default 'valido' check (estado in ('valido','anulado')),
  motivo_anulacion text,
  unique (pase_id, atraccion_id)
);

create index usos_pase_id_idx on public.usos (pase_id);
create index usos_atraccion_id_idx on public.usos (atraccion_id);
create index usos_validado_por_idx on public.usos (validado_por);

alter table public.usos enable row level security;

create policy "usos_turista_ve_historial_de_sus_pases"
  on public.usos for select
  using (
    exists (select 1 from public.pases p where p.id = usos.pase_id and p.usuario_id = auth.uid())
  );

create policy "usos_staff_de_la_atraccion_ve_sus_validaciones"
  on public.usos for select
  using (
    exists (
      select 1 from public.empleados e
      join public.atracciones a on a.partner_id = e.partner_id
      where a.id = usos.atraccion_id and e.auth_user_id = auth.uid()
    )
  );

-- Sin política de INSERT: por diseño, el alta de un `uso` la hace exclusivamente
-- la Edge Function de validación de QR (server-side, con la clave secreta) —
-- el panel de la atracción nunca escribe usos directamente. Ver la regla de
-- validación de QR en fabpass-arquitectura-datos.md.
