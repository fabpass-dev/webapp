-- pgcrypto instala sus funciones (hmac, etc.) en el schema `extensions`, no en
-- `public` — como la función fija search_path = public, hay que calificar el
-- nombre explícitamente.
create or replace function public.firmar_qr_pase()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
  v_secret text;
begin
  select value into v_secret from private.config where key = 'qr_hmac_secret';
  new.qr_firma := encode(
    extensions.hmac(convert_to(new.codigo_qr::text, 'UTF8'), convert_to(v_secret, 'UTF8'), 'sha256'),
    'hex'
  );
  return new;
end;
$$;
