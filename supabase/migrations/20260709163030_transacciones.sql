-- Nota: esta tabla NO tiene columna pase_id. Una transacción (un pago) puede
-- cubrir varios pases independientes (compra grupal: familia/amigos) — esa
-- relación ya queda representada por pases.transaccion_id (ver esa migración).
-- La comisión de partner/empleado se calcula una vez sobre el monto total de
-- la transacción, no por cada pase individual.
create table public.transacciones (
  id uuid primary key default gen_random_uuid(),
  gateway text not null check (gateway in ('mercadopago','stripe')),
  modo_transaccion text not null default 'simulado' check (modo_transaccion in ('simulado','real')),
  monto numeric not null check (monto >= 0),
  moneda text not null,
  estado text not null default 'pendiente' check (estado in ('pendiente','aprobado','rechazado','reembolsado')),
  comision_partner_pct_aplicada numeric,
  monto_comision_partner numeric,
  comision_empleado_pct_aplicada numeric,
  monto_comision_empleado numeric,
  fecha timestamptz not null default now()
);

alter table public.transacciones enable row level security;

-- Las políticas de lectura para turista/partner/empleado se agregan en la
-- migración de `pases`, porque dependen de esa tabla (que todavía no existe
-- en este punto) para saber de quién es cada transacción.
