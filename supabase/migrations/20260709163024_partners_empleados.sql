-- 'atraccion' se agrega como un tipo más de partner: cada atracción que necesita
-- personal propio con login (para escanear QR) se modela como un partner, igual
-- que un hotel. Ver migración de atracciones para el vínculo atracciones.partner_id.
create table public.partners (
  id uuid primary key default gen_random_uuid(),
  nombre text not null,
  tipo text not null check (tipo in ('hotel','agencia','atraccion','otro')),
  codigo_partner text not null unique,
  comision_pct_default numeric not null default 0,
  comision_tipo text not null default 'porcentaje' check (comision_tipo in ('porcentaje','monto_fijo')),
  email_contacto text,
  activo boolean not null default true
);

alter table public.partners enable row level security;

-- Cada empleado (staff) de un partner tiene su propio login (auth_user_id) y un
-- rol: 'admin' ve la parte administrativa/financiera de su partner, 'operativo'
-- solo puede escanear/vender. Sirve igual para hoteles y para atracciones.
create table public.empleados (
  id uuid primary key default gen_random_uuid(),
  partner_id uuid not null references public.partners (id) on delete cascade,
  auth_user_id uuid unique references auth.users (id),
  nombre text not null,
  email text not null,
  codigo_empleado text not null unique,
  rol text not null default 'operativo' check (rol in ('admin','operativo')),
  comision_pct_default numeric not null default 0,
  activo boolean not null default true
);

create index empleados_partner_id_idx on public.empleados (partner_id);
create index empleados_auth_user_id_idx on public.empleados (auth_user_id);

alter table public.empleados enable row level security;

create policy "partners_visible_para_su_propio_staff"
  on public.partners for select
  using (
    exists (
      select 1 from public.empleados e
      where e.partner_id = partners.id and e.auth_user_id = auth.uid()
    )
  );

create policy "empleados_ve_su_propio_registro"
  on public.empleados for select
  using (auth_user_id = auth.uid());

create policy "empleados_admin_ve_a_todo_su_equipo"
  on public.empleados for select
  using (
    exists (
      select 1 from public.empleados yo
      where yo.auth_user_id = auth.uid()
        and yo.partner_id = empleados.partner_id
        and yo.rol = 'admin'
    )
  );
