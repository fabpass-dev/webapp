-- Catálogo inicial real (no son datos de prueba): precios de referencia del
-- documento de arquitectura, para que el checkout tenga algo real que vender
-- mientras no hay acuerdos comerciales cerrados. El admin puede editar precios
-- libremente después sin tocar código.
--
-- FabLife y FabBlack no se cargan todavía: el documento no da precios de
-- referencia para ellos (dependen de acuerdos aún no cerrados).
insert into public.ciudades (nombre, slug, pais, moneda, activa, idioma_default)
values ('Buenos Aires', 'buenosaires', 'Argentina', 'USD', true, 'es');

-- FabDays: la validez coincide con la cantidad de días del nombre de la variante.
insert into public.productos (ciudad_id, tipo, nombre, variante, precio_usd, validez_dias, max_atracciones_por_dia, activo)
select id, 'fabdays', 'FabDays', v.variante, v.precio, v.dias, 3, true
from public.ciudades,
  (values
    ('1dia', 120, 1),
    ('3dias', 220, 3),
    ('5dias', 300, 5),
    ('7dias', 370, 7)
  ) as v(variante, precio, dias)
where slug = 'buenosaires';

-- FabFlex: no está limitado por días, así que usamos una ventana de validez
-- amplia (30 días) para dar tiempo a usar las atracciones — no viene
-- especificado en el documento, lo dejo marcado para confirmar con el usuario.
insert into public.productos (ciudad_id, tipo, nombre, variante, precio_usd, validez_dias, max_atracciones_total, activo)
select id, 'fabflex', 'FabFlex', v.variante, v.precio, 30, v.atracciones, true
from public.ciudades,
  (values
    ('3atracciones', 152, 3),
    ('5atracciones', 210, 5),
    ('7atracciones', 270, 7),
    ('10atracciones', 340, 10)
  ) as v(variante, precio, atracciones)
where slug = 'buenosaires';
