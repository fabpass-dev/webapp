create table public.reembolsos (
  id uuid primary key default gen_random_uuid(),
  pase_id uuid not null references public.pases (id),
  transaccion_id uuid not null references public.transacciones (id),
  motivo text,
  monto_reembolsado numeric not null check (monto_reembolsado >= 0),
  fecha timestamptz not null default now()
);

comment on table public.reembolsos is
  'Regla de negocio: el reembolso total solo se admite si el pase asociado NO fue activado (fecha_activacion is null) Y no pasaron más de 30 días desde pases.fecha_compra. Esa elegibilidad se verifica al momento de pedir el reembolso, no se guarda como columna. Fuera de esas dos condiciones, requiere excepción manual auditada por el admin.';

create index reembolsos_pase_id_idx on public.reembolsos (pase_id);

alter table public.reembolsos enable row level security;

create policy "reembolsos_turista_ve_los_de_sus_pases"
  on public.reembolsos for select
  using (
    exists (select 1 from public.pases p where p.id = reembolsos.pase_id and p.usuario_id = auth.uid())
  );

-- Sin política de INSERT: el alta de un reembolso (automático dentro de la
-- ventana de 30 días, o excepción manual) la hace el backend/admin con la
-- clave secreta, no el cliente.
