create table public.pases (
  id uuid primary key default gen_random_uuid(),
  usuario_id uuid not null references public.usuarios (id),
  producto_id uuid not null references public.productos (id),
  partner_id uuid references public.partners (id),
  empleado_id uuid references public.empleados (id),
  -- UUID no secuencial + firma HMAC (qr_firma) para que el servidor pueda
  -- detectar manipulación del QR. El cálculo/verificación de la firma se hace
  -- en la Edge Function de validación (próximo paso), nunca en el cliente.
  codigo_qr uuid not null default gen_random_uuid() unique,
  qr_firma text,
  codigo_alfanumerico text not null unique,
  fecha_compra timestamptz not null default now(),
  fecha_activacion timestamptz,
  fecha_limite_activacion timestamptz not null,
  fecha_vencimiento_uso timestamptz,
  -- 'en_disputa': lo activa el webhook de contracargo de la pasarela, bloquea
  -- usos nuevos aunque el pase tenga validez vigente.
  estado text not null default 'comprado' check (estado in ('comprado','activo','vencido','agotado','en_disputa')),
  titular_nombre text not null,
  titular_apellido text not null,
  es_menor boolean not null default false,
  foto_titular_url text,
  monto_pagado numeric not null check (monto_pagado >= 0),
  transaccion_id uuid not null references public.transacciones (id)
);

create index pases_usuario_id_idx on public.pases (usuario_id);
create index pases_producto_id_idx on public.pases (producto_id);
create index pases_partner_id_idx on public.pases (partner_id);
create index pases_empleado_id_idx on public.pases (empleado_id);
create index pases_transaccion_id_idx on public.pases (transaccion_id);

alter table public.pases enable row level security;

-- Solo lectura para el propio turista: el alta de un pase pagado se hace desde
-- el servidor (checkout / webhook de pago con la clave secreta), nunca con un
-- insert directo del cliente, para que nadie pueda "crearse" un pase sin pagar.
create policy "pases_turista_lee_los_propios"
  on public.pases for select
  using (usuario_id = auth.uid());

create policy "pases_partner_lee_los_que_vendio"
  on public.pases for select
  using (
    partner_id is not null and exists (
      select 1 from public.empleados e
      where e.partner_id = pases.partner_id and e.auth_user_id = auth.uid()
    )
  );

create policy "pases_empleado_lee_los_que_vendio"
  on public.pases for select
  using (
    empleado_id is not null and exists (
      select 1 from public.empleados e
      where e.id = pases.empleado_id and e.auth_user_id = auth.uid()
    )
  );

-- Políticas de `transacciones` que dependían de que `pases` existiera:
create policy "transacciones_turista_lee_las_propias"
  on public.transacciones for select
  using (
    exists (
      select 1 from public.pases p
      where p.transaccion_id = transacciones.id and p.usuario_id = auth.uid()
    )
  );

create policy "transacciones_partner_lee_las_de_sus_ventas"
  on public.transacciones for select
  using (
    exists (
      select 1 from public.pases p
      join public.empleados e on e.partner_id = p.partner_id
      where p.transaccion_id = transacciones.id and e.auth_user_id = auth.uid()
    )
  );
