-- La migración original de este secreto (20260709170557) tuvo, por un rato,
-- un valor hardcodeado que llegó a mostrarse en una consola de prueba. Se
-- corrigió esa migración para generar el valor al azar dentro de la propia
-- base, y acá se rota el valor ya guardado a uno nuevo (también generado
-- server-side, nunca visto fuera de la base). Es seguro hacerlo ahora porque
-- todavía no existe ningún pase real firmado con el valor anterior.
update private.config
set value = encode(extensions.gen_random_bytes(32), 'hex')
where key = 'qr_hmac_secret';
