-- Son dos shows distintos (confirmado con el usuario) — nombre definitivo
-- pendiente, por ahora "A" y "B" para distinguirlos.
update public.atracciones set nombre = 'Show de Tango A' where nombre = 'Show de Tango' and precio_mayor = 65;
update public.atracciones set nombre = 'Show de Tango B' where nombre = 'Show de Tango (nombre a confirmar)' and precio_mayor = 42;
