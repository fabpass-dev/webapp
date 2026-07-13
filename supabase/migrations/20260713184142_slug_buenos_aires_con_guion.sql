-- Los documentos de páginas (Atracciones, Planificador, Checkout, etc.) usan
-- consistentemente /es/buenos-aires/... con guion. El slug real cargado en
-- Step 2 fue 'buenosaires', sin guion — se corrige para que todos los links
-- entre páginas coincidan.
update public.ciudades set slug = 'buenos-aires' where slug = 'buenosaires';
