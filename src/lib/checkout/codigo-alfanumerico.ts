// Sin caracteres ambiguos (0/O, 1/I) para que sea legible si alguien lo tipea a mano.
const ALFABETO = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";

export function generarCodigoAlfanumerico(): string {
  let codigo = "FP-";
  for (let i = 0; i < 8; i++) {
    codigo += ALFABETO[Math.floor(Math.random() * ALFABETO.length)];
  }
  return codigo;
}
