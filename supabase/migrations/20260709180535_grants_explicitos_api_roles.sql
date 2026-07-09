-- Supabase distingue dos capas de seguridad: RLS (qué filas puede tocar cada
-- rol) y los GRANT de Postgres (qué operaciones puede intentar cada rol,
-- antes de que RLS filtre filas). Hasta ahora dependíamos de que el proyecto
-- ya tuviera esos GRANT otorgados automáticamente (comportamiento heredado) —
-- pero Supabase anunció que ese auto-otorgamiento para tablas nuevas se
-- retira el 2026-10-30, y en local (una base nueva) ya no ocurre. Sin este
-- GRANT explícito, ninguna tabla es alcanzable por la API aunque las
-- políticas de RLS estén bien escritas.
--
-- Los permisos reales de "quién puede ver/tocar qué fila" siguen siendo las
-- políticas de RLS ya escritas — esto solo habilita que Postgres deje
-- intentar la operación; RLS decide fila por fila.
grant usage on schema public to anon, authenticated, service_role;

grant select, insert, update, delete
  on all tables in schema public
  to anon, authenticated, service_role;

-- Para que las tablas que creemos de acá en más también queden cubiertas sin
-- tener que acordarse de repetir este GRANT en cada migración nueva.
alter default privileges in schema public
  grant select, insert, update, delete on tables to anon, authenticated, service_role;
