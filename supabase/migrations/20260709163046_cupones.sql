create table public.cupones (
  id uuid primary key default gen_random_uuid(),
  codigo text not null unique,
  tipo_descuento text not null check (tipo_descuento in ('porcentaje','monto_fijo')),
  valor numeric not null check (valor >= 0),
  vigente_desde timestamptz not null,
  vigente_hasta timestamptz not null,
  limite_usos int check (limite_usos > 0),
  usos_actuales int not null default 0,
  activo boolean not null default true,
  check (vigente_hasta > vigente_desde)
);

alter table public.cupones enable row level security;

-- A propósito, sin política de lectura pública: si cualquiera pudiera hacer
-- `select * from cupones`, alguien podría listar todos los códigos de
-- descuento vigentes. La validación de un código puntual durante el checkout
-- se hace vía una función server-side (Edge Function / RPC), no leyendo la
-- tabla directo desde el cliente.
