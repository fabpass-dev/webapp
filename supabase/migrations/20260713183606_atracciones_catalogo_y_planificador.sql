-- Ampliación de `atracciones` para soportar el catálogo público
-- (FabPass_Atracciones.docx) y el planificador (FabPass_Planificador_v3.docx).
-- Ninguno de los dos documentos usa el modelo de Step 2 tal cual: falta
-- slug, a qué producto da acceso cada atracción, categorías como lista,
-- descuento para Black/Life, reseñas y fotos.

-- 1. slug — necesario para /atracciones/[slug].
create extension if not exists "unaccent" with schema extensions;

alter table public.atracciones add column slug text;
update public.atracciones set slug = lower(regexp_replace(regexp_replace(extensions.unaccent(nombre), '[^a-zA-Z0-9\s-]', '', 'g'), '\s+', '-', 'g'));
-- Desempata slugs iguales (ej. dos atracciones de nombre parecido) antes del unique.
update public.atracciones a set slug = a.slug || '-' || sub.rn
  from (
    select id, row_number() over (partition by slug order by id) as rn
    from public.atracciones
  ) sub
  where a.id = sub.id and sub.rn > 1;
alter table public.atracciones alter column slug set not null;
alter table public.atracciones add constraint atracciones_slug_unique unique (slug);

-- 2. tipo_pase — a qué producto da acceso. FabLife en este modelo son en
-- realidad comercios con descuento (restaurantes, bares, etc.), cargados
-- en la misma tabla que las atracciones tradicionales, distinguidos por
-- este campo. Todo lo ya cargado se asume fabdays_fabflex (el default real
-- hasta ahora: nada se cargó todavía como exclusivo de Black o Life).
alter table public.atracciones add column tipo_pase text not null default 'fabdays_fabflex'
  check (tipo_pase in ('fabdays_fabflex', 'fabflex', 'fabblack', 'fablife'));

-- 3. categorias — pasa de una sola categoría de texto libre a una lista,
-- según la taxonomía de 23 categorías del documento de Atracciones (la
-- lista real; el Planificador usa una agrupación de 6 categorías amplias
-- sobre estas mismas, no una taxonomía distinta).
alter table public.atracciones add column categorias text[] not null default '{}';
update public.atracciones set categorias = array[categoria] where categoria is not null;
alter table public.atracciones drop column categoria;

-- 4. Descuento para FabBlack/FabLife (no tienen precio fijo de pase, sino
-- un % de descuento sobre el precio de carta/individual).
alter table public.atracciones add column descuento_porcentaje numeric;

-- 5. Reseñas — no existen todavía; se guarda el resumen agregado acá
-- (cantidad_reviews en 0 = no se muestra rating en ningún lado, ver
-- páginas nuevas). El detalle de cada reseña individual queda para cuando
-- haya reseñas reales que cargar.
alter table public.atracciones add column rating numeric;
alter table public.atracciones add column cantidad_reviews int not null default 0;

-- 6. Fotos — no hay ninguna cargada todavía; nullable a propósito.
alter table public.atracciones add column foto_url text;
alter table public.atracciones add column fotos_adicionales text[] not null default '{}';

-- 7. Filtros adicionales del catálogo público.
alter table public.atracciones add column al_aire_libre boolean not null default false;
alter table public.atracciones add column solo_adultos boolean not null default false;

-- 8. Horarios explícitos que pide el planificador (día de semana + hora de
-- apertura/cierre), más simples que el jsonb libre de Step 2 que nunca
-- llegó a usarse en ninguna pantalla todavía.
alter table public.atracciones add column dias_apertura text[] not null
  default array['lun','mar','mie','jue','vie','sab','dom'];
alter table public.atracciones add column horario_apertura text;
alter table public.atracciones add column horario_cierre text;
alter table public.atracciones drop column horarios_apertura;

-- 9. Tabla `leads` — captura de email para la guía gratuita del catálogo.
create table public.leads (
  id uuid primary key default gen_random_uuid(),
  email text not null,
  source text not null,
  created_at timestamptz not null default now()
);

create index leads_email_idx on public.leads (email);

alter table public.leads enable row level security;

-- Sin política de SELECT: nadie lee leads ajenos desde el cliente, ni
-- siquiera el propio turista — es un dato de marketing, no de cuenta.
-- El insert lo hace el API route con la clave de servicio.

-- 10. `itinerarios` — el planificador genera itinerarios ANTES de que el
-- turista tenga cuenta (guarda por email + link, sin login), y recién se
-- asocia a un usuario si compra después. El diseño de Step 2 exigía
-- usuario_id desde el principio; se relaja para permitir el caso anónimo.
alter table public.itinerarios alter column usuario_id drop not null;
alter table public.itinerarios add column email text;
alter table public.itinerarios add column dias_turismo int;
alter table public.itinerarios add column adultos int;
alter table public.itinerarios add column menores int;
alter table public.itinerarios add column ritmo text check (ritmo in ('tranquilo', 'moderado', 'intenso'));
alter table public.itinerarios add column fecha_inicio date;
alter table public.itinerarios add column atracciones_ids uuid[] not null default '{}';
alter table public.itinerarios add column pase_recomendado text;
alter table public.itinerarios add column variante_recomendada text;
alter table public.itinerarios add column ahorro_estimado numeric;
alter table public.itinerarios add column link_token text unique;
alter table public.itinerarios add column expires_at timestamptz;

alter table public.itinerarios add constraint itinerarios_usuario_o_email check (
  usuario_id is not null or email is not null
);

-- Sin política de SELECT anónima por link_token a propósito: una policy
-- `using (link_token is not null)` expondría TODOS los itinerarios
-- guardados a cualquiera, no solo a quien conoce el token — RLS filtra
-- filas, no compara contra un valor que el cliente mandó en la URL. El
-- acceso por token se resuelve en un route handler propio, con la clave de
-- servicio, filtrando por `link_token = <token de la URL>` — el token en sí
-- mismo (32 caracteres al azar) es la autorización, igual que un magic link.
