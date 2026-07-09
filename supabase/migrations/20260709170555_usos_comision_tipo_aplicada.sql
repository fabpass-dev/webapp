-- El snapshot de comisión (regla de negocio #3) necesita saber si el % congelado
-- se aplicó como porcentaje o como monto fijo, porque atracciones.comision_tipo
-- puede cambiar más adelante y este registro histórico no debe depender de eso.
alter table public.usos
  add column comision_tipo_aplicada text not null
    check (comision_tipo_aplicada in ('porcentaje','monto_fijo'));
