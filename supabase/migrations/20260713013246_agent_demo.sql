-- Agent de demostración (hotel) para poder probar /agents/auth de punta a
-- punta, igual que ya existe un partner/atracción de demo para /partners/auth.
insert into public.partners (nombre, tipo, codigo_partner, comision_pct_default, comision_tipo, activo)
values ('Hotel Demo Palermo', 'hotel', 'DEMO-HOTEL', 10, 'porcentaje', true);

-- Login de prueba: demo.hotel@thefabpass.com / FabPass2026!
insert into auth.users (
  id, instance_id, aud, role, email, encrypted_password, email_confirmed_at,
  created_at, updated_at, raw_app_meta_data, raw_user_meta_data,
  confirmation_token, recovery_token, email_change_token_new, email_change,
  email_change_token_current, phone_change, phone_change_token, reauthentication_token
)
values (
  gen_random_uuid(), '00000000-0000-0000-0000-000000000000', 'authenticated', 'authenticated',
  'demo.hotel@thefabpass.com', extensions.crypt('FabPass2026!', extensions.gen_salt('bf')), now(),
  now(), now(), '{}', '{}',
  '', '', '', '', '', '', '', ''
);

insert into public.empleados (partner_id, auth_user_id, nombre, email, codigo_empleado, rol, activo)
select
  (select id from public.partners where codigo_partner = 'DEMO-HOTEL'),
  (select id from auth.users where email = 'demo.hotel@thefabpass.com'),
  'Recepción Hotel Demo', 'demo.hotel@thefabpass.com', 'EMP-DEMO-002', 'admin', true;
