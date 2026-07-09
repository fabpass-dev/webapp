create table public.usuarios (
  id uuid primary key references auth.users (id) on delete cascade,
  email text not null unique,
  nombre text,
  apellido text,
  pais_origen text,
  idioma_preferido text not null default 'es' check (idioma_preferido in ('es','en','pt','fr')),
  fecha_registro timestamptz not null default now(),
  ultimo_login timestamptz
);

alter table public.usuarios enable row level security;

create policy "usuarios_lee_su_propio_perfil"
  on public.usuarios for select
  using (auth.uid() = id);

create policy "usuarios_actualiza_su_propio_perfil"
  on public.usuarios for update
  using (auth.uid() = id)
  with check (auth.uid() = id);

-- El checkout es "invitado": la cuenta se crea sola en cuanto existe el auth.users
-- (ver trigger más abajo), pero dejamos también esta política por si algún flujo
-- necesita crear el perfil desde el propio cliente autenticado.
create policy "usuarios_crea_su_propio_perfil"
  on public.usuarios for insert
  with check (auth.uid() = id);

-- Checkout como invitado: en cuanto Supabase Auth crea el usuario (magic link,
-- Google, Apple, o el alta automática post-pago), se crea su fila en `usuarios`
-- copiando el email. Evita depender de que el cliente haga ese insert.
create function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  insert into public.usuarios (id, email)
  values (new.id, new.email)
  on conflict (id) do nothing;
  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();
