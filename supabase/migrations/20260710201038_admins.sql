-- Admin interno de FabPass (no confundir con partners/empleados, que son
-- staff de hoteles/atracciones). El acceso completo a todas las tablas ya
-- funciona vía la clave secreta desde rutas server-side — esta tabla es solo
-- para que la propia app pueda preguntar "¿esta persona logueada es admin?"
-- antes de mostrarle el panel.
create table public.admins (
  user_id uuid primary key references auth.users (id) on delete cascade,
  nombre text,
  creado_en timestamptz not null default now()
);

alter table public.admins enable row level security;

-- Cada admin puede confirmar su propia membresía (necesario para que el
-- panel decida si mostrarse, sin tener que usar la clave secreta solo para
-- este chequeo). Nadie puede leer la lista completa de admins desde el cliente.
create policy "admins_se_ve_a_si_mismo"
  on public.admins for select
  using (user_id = auth.uid());

-- Por email en vez de un id fijo: en el entorno local (Docker) este usuario
-- no existe, así que el select no devuelve filas y el insert no hace nada —
-- sin eso, un id de producción hardcodeado rompería el reset local.
insert into public.admins (user_id, nombre)
select id, 'FabPass (fundador)' from auth.users where email = 'thefabpass@gmail.com'
on conflict (user_id) do nothing;
