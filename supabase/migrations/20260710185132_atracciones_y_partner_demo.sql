-- Catálogo real (con precios provisorios) para tener algo que mostrar en
-- "qué incluye cada pase" y para poder probar de punta a punta la validación
-- de QR en una atracción real.
insert into public.atracciones (
  ciudad_id, nombre, categoria, barrio, precio_mayor, precio_menor,
  duracion_horas, requiere_reserva, gratuito, relevancia, imperdible,
  mejor_momento, apto_familia, apto_lluvia, activa, comision_pct_default, comision_tipo
)
select id, 'MALBA — Museo de Arte Latinoamericano', 'Museo', 'Palermo', 20, 10,
  2, false, false, 9, true, 'tarde', true, true, true, 15, 'porcentaje'
from public.ciudades where slug = 'buenosaires';

insert into public.atracciones (
  ciudad_id, nombre, categoria, barrio, precio_mayor, precio_menor,
  duracion_horas, requiere_reserva, gratuito, relevancia, imperdible,
  mejor_momento, apto_familia, apto_lluvia, activa, comision_pct_default, comision_tipo
)
select id, 'Teatro Colón — Visita guiada', 'Cultura', 'San Nicolás', 25, 15,
  1.5, true, false, 10, true, 'mañana', true, true, true, 15, 'porcentaje'
from public.ciudades where slug = 'buenosaires';

insert into public.atracciones (
  ciudad_id, nombre, categoria, barrio, precio_mayor, precio_menor,
  duracion_horas, requiere_reserva, gratuito, relevancia, imperdible,
  mejor_momento, apto_familia, apto_lluvia, activa, comision_pct_default, comision_tipo
)
select id, 'Jardín Japonés', 'Parque', 'Palermo', 12, 6,
  1.5, false, false, 7, false, 'mañana', true, false, true, 15, 'porcentaje'
from public.ciudades where slug = 'buenosaires';

-- Partner de demostración: representa a MALBA como cuenta que puede
-- loguearse para validar QR. codigo_partner y credenciales son de prueba —
-- reemplazar cuando haya un acuerdo comercial real y un panel de admin para
-- gestionarlo sin migraciones.
insert into public.partners (nombre, tipo, codigo_partner, comision_pct_default, comision_tipo, activo)
values ('MALBA (demo)', 'atraccion', 'DEMO-MALBA', 15, 'porcentaje', true);

update public.atracciones
set partner_id = (select id from public.partners where codigo_partner = 'DEMO-MALBA')
where nombre = 'MALBA — Museo de Arte Latinoamericano';

-- Login de prueba: demo.malba@thefabpass.com / FabPass2026!
-- (los campos *_token deben ir en '' y no NULL o el login por contraseña
-- rompe con "converting NULL to string is unsupported" — confirmado
-- probando local antes de aplicar esto a la base real).
insert into auth.users (
  id, instance_id, aud, role, email, encrypted_password, email_confirmed_at,
  created_at, updated_at, raw_app_meta_data, raw_user_meta_data,
  confirmation_token, recovery_token, email_change_token_new, email_change,
  email_change_token_current, phone_change, phone_change_token, reauthentication_token
)
values (
  gen_random_uuid(), '00000000-0000-0000-0000-000000000000', 'authenticated', 'authenticated',
  'demo.malba@thefabpass.com', extensions.crypt('FabPass2026!', extensions.gen_salt('bf')), now(),
  now(), now(), '{}', '{}',
  '', '', '', '', '', '', '', ''
);

insert into public.empleados (partner_id, auth_user_id, nombre, email, codigo_empleado, rol, activo)
select
  (select id from public.partners where codigo_partner = 'DEMO-MALBA'),
  (select id from auth.users where email = 'demo.malba@thefabpass.com'),
  'Empleado Demo MALBA', 'demo.malba@thefabpass.com', 'EMP-DEMO-001', 'operativo', true;
