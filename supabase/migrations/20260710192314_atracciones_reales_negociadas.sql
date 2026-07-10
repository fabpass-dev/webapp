-- Lista real de atracciones negociadas que pasó el usuario (precios USD y %
-- de negociación real, no más datos de relleno). Todas al 50% de comisión.
-- precio_menor, barrio, duración, etc. no vinieron en esta lista — quedan en
-- null hasta tener ese dato; el sistema ya sabe usar precio_mayor de fallback.
--
-- Tres nombres (MALBA, Teatro Colón, Jardín Japonés) ya existían con precios
-- de relleno de una carga anterior — se actualizan en vez de duplicarse, para
-- no romper el vínculo de MALBA con el partner/empleado de demo ya creado.
update public.atracciones
set nombre = 'MALBA', categoria = 'Museos', precio_mayor = 6, comision_pct_default = 50, comision_tipo = 'porcentaje'
where nombre = 'MALBA — Museo de Arte Latinoamericano';

update public.atracciones
set nombre = 'Teatro Colón', categoria = 'Teatro', precio_mayor = 19, comision_pct_default = 50, comision_tipo = 'porcentaje'
where nombre = 'Teatro Colón — Visita guiada';

update public.atracciones
set categoria = 'Parques', precio_mayor = 9, comision_pct_default = 50, comision_tipo = 'porcentaje'
where nombre = 'Jardín Japonés';

insert into public.atracciones (ciudad_id, nombre, categoria, precio_mayor, comision_pct_default, comision_tipo, activa, gratuito)
select id, v.nombre, v.categoria, v.precio, 50, 'porcentaje', true, false
from public.ciudades,
  (values
    ('BT Tigre y Delta', 'Biking Tours', 70),
    ('Show de Tango', 'Experiencias', 65),
    ('Navegación Puerto Madero', 'Boating Tour', 57),
    ('Cata de Vinos', 'Experiencias', 49),
    ('BT Buenos Aires Diferente', 'Biking Tours', 48),
    ('BT Recoleta y Palermo', 'Biking Tours', 48),
    ('BT Graffiti and Street Art', 'Biking Tours', 48),
    ('BT Mujeres Argentinas', 'Biking Tours', 48),
    ('Atardecer en barco río de la plata', 'Boating Tour', 45),
    ('Show de Tango (nombre a confirmar)', 'Experiencias', 42),
    ('Bus Turístico 72 hs.', 'Movilidad', 40),
    ('Clase Privada de Tango', 'Experiencias', 40),
    ('Palacio Barolo', 'Edificios Históricos', 38),
    ('Tierra Santa', 'Parque Diversiones', 29),
    ('Recoleta', 'Walking Tours', 25),
    ('Museo River', 'Museos', 25),
    ('Museo Boca', 'Museos', 25),
    ('Navegación BA', 'Boating Tour', 24),
    ('Temaiken', 'Zoológico', 24),
    ('Parque de la Costa', 'Parque Diversiones', 24),
    ('Navegación Paseo de los 6 ríos', 'Boating Tour', 18),
    ('Zanjón de Granados', 'Edificios Históricos', 17),
    ('Clase de Tango', 'Experiencias', 15),
    ('Museo de Arte Moderno', 'Museos', 11),
    ('La Boca', 'Walking Tours', 10),
    ('Palermo Graffiti', 'Walking Tours', 10),
    ('San Telmo y Market', 'Walking Tours', 10),
    ('Museo Evita', 'Museos', 7),
    ('Museo Fortabat', 'Museos', 4)
  ) as v(nombre, categoria, precio)
where slug = 'buenosaires';
