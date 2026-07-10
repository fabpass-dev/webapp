import QRCode from "qrcode";

// Sirve el código QR como una imagen PNG real, para poder referenciarla con
// una URL normal (<img src="...">) en el email — Gmail y la mayoría de los
// clientes de correo no muestran imágenes incrustadas por Content-ID de forma
// confiable, pero sí una imagen alojada en una URL cualquiera.
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const data = searchParams.get("data");

  if (!data) {
    return new Response("Falta el parámetro data", { status: 400 });
  }

  const png = await QRCode.toBuffer(data, { width: 300 });

  return new Response(new Uint8Array(png), {
    headers: {
      "Content-Type": "image/png",
      "Cache-Control": "public, max-age=31536000, immutable",
    },
  });
}
