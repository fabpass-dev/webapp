"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";

type Atraccion = { id: string; nombre: string };

type Resultado = {
  permitido: boolean;
  motivo?: string;
  titular?: string;
  tipo_pase?: string;
  restantes?: number | null;
};

const MOTIVOS: Record<string, string> = {
  codigo_invalido: "Código inválido o QR manipulado",
  staff_no_autorizado: "Tu usuario no está autorizado para esta atracción",
  pase_vencido: "El pase está vencido",
  pase_en_disputa: "El pase está en disputa (contracargo) — no se puede usar",
  plazo_activacion_vencido: "Venció el plazo de 1 año para activar este pase",
  ventana_uso_vencida: "Venció la ventana de validez del pase",
  ya_utilizado_en_esta_atraccion: "Este pase ya se usó en esta atracción",
  limite_diario_alcanzado: "Este pase ya alcanzó su límite de atracciones por día",
  pase_agotado: "Este pase ya alcanzó su límite total de atracciones",
};

export function ValidarQrForm({ atracciones }: { atracciones: Atraccion[] }) {
  const [atraccionId, setAtraccionId] = useState(atracciones[0]?.id ?? "");
  const [codigo, setCodigo] = useState("");
  const [resultado, setResultado] = useState<Resultado | null>(null);
  const [enviando, setEnviando] = useState(false);

  async function validar() {
    setEnviando(true);
    setResultado(null);
    const [codigoQr, firma] = codigo.trim().split(".");
    const { data, error } = await createClient().rpc("validar_qr", {
      p_codigo_qr: codigoQr,
      p_firma: firma ?? "",
      p_atraccion_id: atraccionId,
    });
    if (error) {
      setResultado({ permitido: false, motivo: "error_de_conexion" });
    } else {
      setResultado(data as Resultado);
    }
    setEnviando(false);
    setCodigo("");
  }

  return (
    <div className="flex flex-col gap-4 max-w-sm">
      <div className="flex flex-col gap-2">
        <label className="text-sm font-semibold">Atracción</label>
        <select
          className="border rounded px-2 py-1"
          value={atraccionId}
          onChange={(e) => setAtraccionId(e.target.value)}
        >
          {atracciones.map((a) => (
            <option key={a.id} value={a.id}>
              {a.nombre}
            </option>
          ))}
        </select>
      </div>

      <div className="flex flex-col gap-2">
        <label className="text-sm font-semibold">
          Código escaneado (por ahora, pegalo manualmente — la cámara es un paso siguiente)
        </label>
        <input
          className="border rounded px-2 py-1"
          value={codigo}
          onChange={(e) => setCodigo(e.target.value)}
          placeholder="codigo_qr.firma"
        />
      </div>

      <button
        className="rounded bg-black text-white px-4 py-2 disabled:opacity-50"
        onClick={validar}
        disabled={enviando || !codigo || !atraccionId}
      >
        {enviando ? "Validando..." : "Validar"}
      </button>

      {resultado && (
        <div
          className={`rounded border p-4 ${resultado.permitido ? "border-green-600 bg-green-50" : "border-red-600 bg-red-50"}`}
        >
          {resultado.permitido ? (
            <>
              <p className="font-bold text-green-700">✓ PERMITIDO</p>
              <p>{resultado.titular}</p>
              <p className="text-sm text-gray-600">
                {resultado.tipo_pase}
                {resultado.restantes !== null && resultado.restantes !== undefined
                  ? ` — restantes: ${resultado.restantes}`
                  : ""}
              </p>
            </>
          ) : (
            <>
              <p className="font-bold text-red-700">✗ DENEGADO</p>
              <p className="text-sm">{MOTIVOS[resultado.motivo ?? ""] ?? resultado.motivo}</p>
            </>
          )}
        </div>
      )}
    </div>
  );
}
