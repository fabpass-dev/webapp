"use client";

export function ImprimirBoton() {
  return (
    <button
      type="button"
      className="text-sm underline print:hidden"
      onClick={() => window.print()}
    >
      Imprimir
    </button>
  );
}
