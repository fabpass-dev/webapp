-- Bug real encontrado probando el checkout: varias políticas de RLS hacen
-- "EXISTS (select ... from empleados ...)" desde otras tablas, y la propia
-- tabla empleados tenía una política que también se consulta a sí misma
-- (empleados_admin_ve_a_todo_su_equipo). Cuando Postgres evalúa RLS de
-- cualquier tabla que consulta empleados, también aplica las políticas DE
-- empleados a esa subconsulta — y esa política se re-consulta a sí misma sin
-- parar: "infinite recursion detected in policy for relation empleados".
--
-- Arreglo estándar: mover esas comprobaciones a funciones `security definer`.
-- Como el dueño de las funciones (postgres) es también el dueño de la tabla
-- empleados, la tabla queda exenta de su propio RLS *dentro* de la función —
-- se corta la recursión sin cambiar a quién le está permitido ver qué fila.

create or replace function public.empleado_de_partner(p_partner_id uuid)
returns boolean
language sql
security definer
stable
set search_path = public
as $$
  select exists (
    select 1 from public.empleados e
    where e.partner_id = p_partner_id and e.auth_user_id = auth.uid() and e.activo
  );
$$;

create or replace function public.empleado_admin_de_partner(p_partner_id uuid)
returns boolean
language sql
security definer
stable
set search_path = public
as $$
  select exists (
    select 1 from public.empleados e
    where e.partner_id = p_partner_id and e.auth_user_id = auth.uid() and e.activo and e.rol = 'admin'
  );
$$;

create or replace function public.mi_empleado_id()
returns uuid
language sql
security definer
stable
set search_path = public
as $$
  select e.id from public.empleados e where e.auth_user_id = auth.uid() and e.activo limit 1;
$$;

grant execute on function public.empleado_de_partner(uuid) to anon, authenticated;
grant execute on function public.empleado_admin_de_partner(uuid) to anon, authenticated;
grant execute on function public.mi_empleado_id() to anon, authenticated;

-- empleados
drop policy "empleados_admin_ve_a_todo_su_equipo" on public.empleados;
create policy "empleados_admin_ve_a_todo_su_equipo"
  on public.empleados for select
  using (public.empleado_admin_de_partner(partner_id));

-- partners
drop policy "partners_visible_para_su_propio_staff" on public.partners;
create policy "partners_visible_para_su_propio_staff"
  on public.partners for select
  using (public.empleado_de_partner(id));

-- atracciones
drop policy "atracciones_visibles_para_su_propio_staff" on public.atracciones;
create policy "atracciones_visibles_para_su_propio_staff"
  on public.atracciones for select
  using (public.empleado_de_partner(partner_id));

-- pases
drop policy "pases_partner_lee_los_que_vendio" on public.pases;
create policy "pases_partner_lee_los_que_vendio"
  on public.pases for select
  using (partner_id is not null and public.empleado_de_partner(partner_id));

drop policy "pases_empleado_lee_los_que_vendio" on public.pases;
create policy "pases_empleado_lee_los_que_vendio"
  on public.pases for select
  using (empleado_id is not null and empleado_id = public.mi_empleado_id());

-- transacciones
drop policy "transacciones_partner_lee_las_de_sus_ventas" on public.transacciones;
create policy "transacciones_partner_lee_las_de_sus_ventas"
  on public.transacciones for select
  using (
    exists (
      select 1 from public.pases p
      where p.transaccion_id = transacciones.id
        and p.partner_id is not null
        and public.empleado_de_partner(p.partner_id)
    )
  );

-- usos
drop policy "usos_staff_de_la_atraccion_ve_sus_validaciones" on public.usos;
create policy "usos_staff_de_la_atraccion_ve_sus_validaciones"
  on public.usos for select
  using (
    exists (
      select 1 from public.atracciones a
      where a.id = usos.atraccion_id and public.empleado_de_partner(a.partner_id)
    )
  );

-- liquidaciones
drop policy "liquidaciones_admin_de_partner_ve_las_propias" on public.liquidaciones;
create policy "liquidaciones_admin_de_partner_ve_las_propias"
  on public.liquidaciones for select
  using (partner_id is not null and public.empleado_admin_de_partner(partner_id));

drop policy "liquidaciones_empleado_ve_las_propias" on public.liquidaciones;
create policy "liquidaciones_empleado_ve_las_propias"
  on public.liquidaciones for select
  using (empleado_id is not null and empleado_id = public.mi_empleado_id());

-- reservas
drop policy "reservas_staff_de_la_atraccion_ve_las_suyas" on public.reservas;
create policy "reservas_staff_de_la_atraccion_ve_las_suyas"
  on public.reservas for select
  using (
    exists (
      select 1 from public.atracciones a
      where a.id = reservas.atraccion_id and public.empleado_de_partner(a.partner_id)
    )
  );
