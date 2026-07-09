-- Requisito no negociable: codigo_qr (UUID no secuencial) va acompañado de una
-- firma HMAC, para que el servidor pueda detectar manipulación del contenido
-- del QR (no solo verificar que el código exista en la base). El QR físico que
-- se muestra/escanea codifica "codigo_qr.qr_firma"; el servidor compara la
-- firma recibida contra la que quedó guardada al crear el pase.
--
-- El secreto se guarda en una tabla dentro del schema `private`, que no está
-- expuesto por la API de Supabase (PostgREST solo expone el schema `public`),
-- así que ningún cliente puede leerlo sin importar las políticas de RLS. Solo
-- las funciones de este archivo, que corren dentro de Postgres, lo leen.
--
-- El valor se genera al azar DENTRO de la base con gen_random_bytes() — nunca
-- queda escrito en ningún archivo del repo ni en el historial de git.
create schema if not exists private;

create table private.config (
  key text primary key,
  value text not null
);

insert into private.config (key, value)
values ('qr_hmac_secret', encode(extensions.gen_random_bytes(32), 'hex'));

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
  new.qr_firma := encode(hmac(new.codigo_qr::text, v_secret, 'sha256'), 'hex');
  return new;
end;
$$;

create trigger trg_firmar_qr_pase
  before insert on public.pases
  for each row execute function public.firmar_qr_pase();
