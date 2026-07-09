-- hmac() de pgcrypto espera bytea, no text; convert_to() hace esa conversión
-- de forma explícita (un cast directo text::bytea depende de bytea_output y
-- puede fallar o dar resultados inesperados).
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
    hmac(convert_to(new.codigo_qr::text, 'UTF8'), convert_to(v_secret, 'UTF8'), 'sha256'),
    'hex'
  );
  return new;
end;
$$;
