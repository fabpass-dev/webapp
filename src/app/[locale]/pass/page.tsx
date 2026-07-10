import QRCode from "qrcode";
import { createClient } from "@/lib/supabase/server";
import { PedirMagicLink } from "@/components/PedirMagicLink";
import { ImprimirBoton } from "@/components/ImprimirBoton";

export default async function MiPasePage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return (
      <main className="p-8 max-w-xl mx-auto flex flex-col gap-4">
        <h1 className="text-2xl font-bold">Mi FabPass</h1>
        <PedirMagicLink />
      </main>
    );
  }

  const { data: pases } = await supabase
    .from("pases")
    .select("id, codigo_qr, qr_firma, estado, titular_nombre, titular_apellido, productos(nombre, variante)")
    .eq("usuario_id", user.id)
    .order("fecha_compra", { ascending: false });

  const pasesConQr = await Promise.all(
    (pases ?? []).map(async (p) => ({
      ...p,
      qrDataUrl: await QRCode.toDataURL(`${p.codigo_qr}.${p.qr_firma}`, { width: 220 }),
    })),
  );

  return (
    <main className="p-8 max-w-xl mx-auto flex flex-col gap-6">
      <h1 className="text-2xl font-bold">Mi FabPass</h1>
      {pasesConQr.length === 0 && <p>Todavía no tenés pases.</p>}
      {pasesConQr.map((p) => (
        <div key={p.id} className="border rounded p-4 flex gap-4 items-center">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={p.qrDataUrl} alt="Código QR del pase" width={110} height={110} />
          <div className="flex flex-col gap-1">
            <p className="font-semibold">
              {p.titular_nombre} {p.titular_apellido}
            </p>
            <p className="text-sm text-gray-500">
              {(p.productos as unknown as { nombre: string; variante: string } | null)?.nombre}{" "}
              {(p.productos as unknown as { nombre: string; variante: string } | null)?.variante}
            </p>
            <p className="text-sm">Estado: {p.estado}</p>
            <div className="flex gap-3 mt-1 print:hidden">
              <a
                href={p.qrDataUrl}
                download={`fabpass-${p.titular_nombre}-${p.titular_apellido}.png`}
                className="text-sm underline"
              >
                Descargar
              </a>
              <ImprimirBoton />
            </div>
          </div>
        </div>
      ))}
    </main>
  );
}
