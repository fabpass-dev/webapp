-- Un pase reembolsado deja de ser un estado implícito (borrar o ignorar la
-- fila) y pasa a ser un estado explícito, igual que vencido/agotado/en_disputa.
alter table public.pases drop constraint pases_estado_check;
alter table public.pases add constraint pases_estado_check
  check (estado in ('comprado', 'activo', 'vencido', 'agotado', 'en_disputa', 'reembolsado'));

-- Un pase reembolsado nunca debe poder usarse, aunque alguien intente
-- escanearlo igual (no debería tener QR circulando, pero por las dudas).
create or replace function public.validar_qr(
  p_codigo_qr uuid,
  p_firma text,
  p_atraccion_id uuid
)
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  v_empleado record;
  v_pase record;
  v_producto record;
  v_atraccion record;
  v_usos_hoy int;
  v_usos_total int;
  v_precio numeric;
  v_monto numeric;
begin
  select e.* into v_empleado
    from public.empleados e
    join public.atracciones a on a.partner_id = e.partner_id
    where a.id = p_atraccion_id and e.auth_user_id = auth.uid() and e.activo;
  if not found then
    return jsonb_build_object('permitido', false, 'motivo', 'staff_no_autorizado');
  end if;

  select * into v_pase from public.pases where codigo_qr = p_codigo_qr;
  if not found then
    return jsonb_build_object('permitido', false, 'motivo', 'codigo_invalido');
  end if;

  if v_pase.qr_firma is distinct from p_firma then
    return jsonb_build_object('permitido', false, 'motivo', 'codigo_invalido');
  end if;

  if v_pase.estado in ('vencido', 'agotado', 'reembolsado') then
    return jsonb_build_object('permitido', false, 'motivo', 'pase_vencido');
  end if;
  if v_pase.estado = 'en_disputa' then
    return jsonb_build_object('permitido', false, 'motivo', 'pase_en_disputa');
  end if;

  select * into v_producto from public.productos where id = v_pase.producto_id;

  if v_pase.fecha_activacion is null then
    if now() > v_pase.fecha_limite_activacion then
      update public.pases set estado = 'vencido' where id = v_pase.id;
      return jsonb_build_object('permitido', false, 'motivo', 'plazo_activacion_vencido');
    end if;

    update public.pases
      set fecha_activacion = now(),
          fecha_vencimiento_uso = now() + (v_producto.validez_dias || ' days')::interval,
          estado = 'activo'
      where id = v_pase.id
      returning * into v_pase;
  else
    if now() > v_pase.fecha_vencimiento_uso then
      update public.pases set estado = 'vencido' where id = v_pase.id;
      return jsonb_build_object('permitido', false, 'motivo', 'ventana_uso_vencida');
    end if;
  end if;

  if exists (
    select 1 from public.usos
    where pase_id = v_pase.id and atraccion_id = p_atraccion_id and estado = 'valido'
  ) then
    return jsonb_build_object('permitido', false, 'motivo', 'ya_utilizado_en_esta_atraccion');
  end if;

  if v_producto.tipo = 'fabdays' and v_producto.max_atracciones_por_dia is not null then
    select count(*) into v_usos_hoy from public.usos
      where pase_id = v_pase.id and estado = 'valido' and fecha_hora::date = now()::date;
    if v_usos_hoy >= v_producto.max_atracciones_por_dia then
      return jsonb_build_object('permitido', false, 'motivo', 'limite_diario_alcanzado');
    end if;
  end if;

  if v_producto.tipo = 'fabflex' and v_producto.max_atracciones_total is not null then
    select count(*) into v_usos_total from public.usos
      where pase_id = v_pase.id and estado = 'valido';
    if v_usos_total >= v_producto.max_atracciones_total then
      update public.pases set estado = 'agotado' where id = v_pase.id;
      return jsonb_build_object('permitido', false, 'motivo', 'pase_agotado');
    end if;
  end if;

  select * into v_atraccion from public.atracciones where id = p_atraccion_id;

  v_precio := case
    when v_pase.es_menor then coalesce(v_atraccion.precio_menor, v_atraccion.precio_mayor)
    else v_atraccion.precio_mayor
  end;

  v_monto := case
    when v_atraccion.comision_tipo = 'monto_fijo' then v_atraccion.comision_pct_default
    else round(v_precio * v_atraccion.comision_pct_default / 100, 2)
  end;

  insert into public.usos (
    pase_id, atraccion_id, comision_pct_aplicada, comision_tipo_aplicada, monto_a_liquidar, validado_por
  ) values (
    v_pase.id, p_atraccion_id, v_atraccion.comision_pct_default, v_atraccion.comision_tipo, v_monto, v_empleado.id
  );

  return jsonb_build_object(
    'permitido', true,
    'titular', v_pase.titular_nombre || ' ' || v_pase.titular_apellido,
    'tipo_pase', v_producto.tipo,
    'restantes', case
      when v_producto.tipo = 'fabdays' and v_producto.max_atracciones_por_dia is not null
        then v_producto.max_atracciones_por_dia - v_usos_hoy - 1
      when v_producto.tipo = 'fabflex' and v_producto.max_atracciones_total is not null
        then v_producto.max_atracciones_total - v_usos_total - 1
      else null
    end
  );
end;
$$;
