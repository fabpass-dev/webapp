-- Separación real de Partners (atracciones) y Agents (vendedores: hoteles,
-- agencias, otros). Hasta ahora ambos vivían en `partners` con un campo
-- `tipo` que los distinguía — decisión tomada para no bloquear Step 2, pero
-- señalada por el usuario como deuda técnica una vez que el producto empezó
-- a tratarlos como conceptos de negocio distintos (Partners validan/reciben
-- turistas, Agents venden pases y cobran comisión por venta). Se separa
-- ahora, temprano, mientras el costo de migrar datos reales es mínimo.
--
-- `partners`/`empleados` quedan EXCLUSIVAMENTE para atracciones (se les saca
-- la columna `tipo`, que ya no tiene sentido: siempre iba a valer 'atraccion').
-- `agents`/`agents_empleados` son tablas nuevas, estructura espejo, para
-- hoteles/agencias/otros. Los IDs se preservan al mover filas para que el
-- backfill de FKs sea directo (mismo id, tabla distinta).

-- 1. Tablas nuevas.
create table public.agents (
  id uuid primary key default gen_random_uuid(),
  nombre text not null,
  tipo text not null check (tipo in ('hotel','agencia','otro')),
  codigo_agent text not null unique,
  comision_pct_default numeric not null default 0,
  comision_tipo text not null default 'porcentaje' check (comision_tipo in ('porcentaje','monto_fijo')),
  email_contacto text,
  activo boolean not null default true
);

alter table public.agents enable row level security;

create table public.agents_empleados (
  id uuid primary key default gen_random_uuid(),
  agent_id uuid not null references public.agents (id) on delete cascade,
  auth_user_id uuid unique references auth.users (id),
  nombre text not null,
  email text not null,
  codigo_empleado text not null unique,
  rol text not null default 'operativo' check (rol in ('admin','operativo')),
  comision_pct_default numeric not null default 0,
  activo boolean not null default true
);

create index agents_empleados_agent_id_idx on public.agents_empleados (agent_id);
create index agents_empleados_auth_user_id_idx on public.agents_empleados (auth_user_id);

alter table public.agents_empleados enable row level security;

-- 2. Mover datos: cualquier partner que no sea 'atraccion' pasa a ser agent
-- (mismo id, para que el backfill de más abajo sea trivial).
insert into public.agents (id, nombre, tipo, codigo_agent, comision_pct_default, comision_tipo, email_contacto, activo)
select id, nombre, tipo, codigo_partner, comision_pct_default, comision_tipo, email_contacto, activo
from public.partners
where tipo != 'atraccion';

insert into public.agents_empleados (id, agent_id, auth_user_id, nombre, email, codigo_empleado, rol, comision_pct_default, activo)
select e.id, e.partner_id, e.auth_user_id, e.nombre, e.email, e.codigo_empleado, e.rol, e.comision_pct_default, e.activo
from public.empleados e
where e.partner_id in (select id from public.agents);

-- 3. `pases`/`liquidaciones` referenciaban partner_id/empleado_id para
-- "quién vendió esto" — eso siempre fue un concepto de Agent (las
-- atracciones nunca venden, solo validan vía `usos`). Se agregan las
-- columnas nuevas, se hace el backfill (hoy no hay ninguna venta atribuida
-- todavía — el checkout nunca llegó a completar esta parte — pero se
-- backfillea igual por si acaso) y se borran las viejas.
alter table public.pases add column agent_id uuid references public.agents (id);
alter table public.pases add column agent_empleado_id uuid references public.agents_empleados (id);

update public.pases set agent_id = partner_id where partner_id in (select id from public.agents);
update public.pases set agent_empleado_id = empleado_id where empleado_id in (select id from public.agents_empleados);

drop policy "pases_partner_lee_los_que_vendio" on public.pases;
drop policy "pases_empleado_lee_los_que_vendio" on public.pases;
drop policy "transacciones_partner_lee_las_de_sus_ventas" on public.transacciones;

alter table public.pases drop column partner_id;
alter table public.pases drop column empleado_id;

alter table public.liquidaciones add column agent_empleado_id uuid references public.agents_empleados (id);
update public.liquidaciones set agent_empleado_id = empleado_id where empleado_id in (select id from public.agents_empleados);

drop policy "liquidaciones_empleado_ve_las_propias" on public.liquidaciones;

alter table public.liquidaciones drop constraint liquidaciones_check;
alter table public.liquidaciones drop column empleado_id;
alter table public.liquidaciones add constraint liquidaciones_check check (
  (partner_id is not null and agent_empleado_id is null) or
  (partner_id is null and agent_empleado_id is not null)
);

-- 4. Ya migradas, se borran las filas de agent de `partners`/`empleados`
-- (empleados cae en cascada por el on delete cascade de partner_id).
delete from public.partners where tipo != 'atraccion';

-- 5. `partners` queda exclusivamente para atracciones: la columna `tipo`
-- ya no distingue nada (siempre 'atraccion'), se saca.
alter table public.partners drop column tipo;

-- 6. Funciones security-definer para RLS de agents/agents_empleados, mismo
-- patrón que ya se usó para partners/empleados (evita la recursión de RLS
-- encontrada en esa tabla desde el vamos, en vez de descubrirla de nuevo).
create or replace function public.agent_empleado_de_agent(p_agent_id uuid)
returns boolean
language sql
security definer
stable
set search_path = public
as $$
  select exists (
    select 1 from public.agents_empleados e
    where e.agent_id = p_agent_id and e.auth_user_id = auth.uid() and e.activo
  );
$$;

create or replace function public.agent_empleado_admin_de_agent(p_agent_id uuid)
returns boolean
language sql
security definer
stable
set search_path = public
as $$
  select exists (
    select 1 from public.agents_empleados e
    where e.agent_id = p_agent_id and e.auth_user_id = auth.uid() and e.activo and e.rol = 'admin'
  );
$$;

create or replace function public.mi_agent_empleado_id()
returns uuid
language sql
security definer
stable
set search_path = public
as $$
  select e.id from public.agents_empleados e where e.auth_user_id = auth.uid() and e.activo limit 1;
$$;

grant execute on function public.agent_empleado_de_agent(uuid) to anon, authenticated;
grant execute on function public.agent_empleado_admin_de_agent(uuid) to anon, authenticated;
grant execute on function public.mi_agent_empleado_id() to anon, authenticated;

create policy "agents_visible_para_su_propio_staff"
  on public.agents for select
  using (public.agent_empleado_de_agent(id));

create policy "agents_empleados_ve_su_propio_registro"
  on public.agents_empleados for select
  using (auth_user_id = auth.uid());

create policy "agents_empleados_admin_ve_a_todo_su_equipo"
  on public.agents_empleados for select
  using (public.agent_empleado_admin_de_agent(agent_id));

create policy "pases_agent_lee_los_que_vendio"
  on public.pases for select
  using (agent_id is not null and public.agent_empleado_de_agent(agent_id));

create policy "pases_agent_empleado_lee_los_que_vendio"
  on public.pases for select
  using (agent_empleado_id is not null and agent_empleado_id = public.mi_agent_empleado_id());

create policy "transacciones_agent_lee_las_de_sus_ventas"
  on public.transacciones for select
  using (
    exists (
      select 1 from public.pases p
      where p.transaccion_id = transacciones.id
        and p.agent_id is not null
        and public.agent_empleado_de_agent(p.agent_id)
    )
  );

create policy "liquidaciones_agent_empleado_ve_las_propias"
  on public.liquidaciones for select
  using (agent_empleado_id is not null and agent_empleado_id = public.mi_agent_empleado_id());

-- GRANT explícito: las tablas nuevas ya quedan cubiertas por el
-- `alter default privileges` de la migración de grants, pero se deja
-- explícito acá también por claridad (no hace daño repetirlo).
grant select, insert, update, delete on public.agents, public.agents_empleados to anon, authenticated, service_role;
