import { Resend } from "resend";
import QRCode from "qrcode";

type PaseParaEmail = {
  codigo_qr: string;
  qr_firma: string;
  codigo_alfanumerico: string;
  titular_nombre: string;
  titular_apellido: string;
};

// Remitente de prueba de Resend hasta que se verifique un dominio propio
// (ver memoria del proyecto: se va a migrar a mail.thefabpass.com).
const REMITENTE = "FabPass <onboarding@resend.dev>";

export async function enviarPasesPorEmail(email: string, nombreProducto: string, pases: PaseParaEmail[]) {
  const resendKey = process.env.RESEND_API_KEY;
  if (!resendKey) return;

  const resend = new Resend(resendKey);

  const adjuntos = await Promise.all(
    pases.map(async (p, i) => ({
      filename: `fabpass-${p.codigo_alfanumerico}.png`,
      content: await QRCode.toBuffer(`${p.codigo_qr}.${p.qr_firma}`, { width: 300 }),
      content_id: `qr${i}`,
    })),
  );

  const cuerpoPases = pases
    .map(
      (p, i) => `
        <div style="margin-bottom:24px;padding:16px;border:1px solid #ddd;border-radius:8px;">
          <p style="margin:0 0 8px;font-weight:bold;">${p.titular_nombre} ${p.titular_apellido}</p>
          <p style="margin:0 0 8px;color:#666;font-size:14px;">${nombreProducto} — Código: ${p.codigo_alfanumerico}</p>
          <img src="cid:qr${i}" width="220" height="220" alt="Código QR" />
        </div>
      `,
    )
    .join("");

  const { error } = await resend.emails.send({
    from: REMITENTE,
    to: email,
    subject: "Tu FabPass — comprobante de compra",
    html: `
      <div style="font-family:sans-serif;max-width:480px;margin:0 auto;">
        <h1 style="font-size:20px;">¡Gracias por tu compra!</h1>
        <p>Guardá este email — tiene el/los código${pases.length > 1 ? "s" : ""} QR de tu pase.</p>
        ${cuerpoPases}
        <p style="color:#666;font-size:13px;">También podés ver tu pase online entrando a "Mi FabPass" con el link mágico que te mandamos por separado.</p>
      </div>
    `,
    attachments: adjuntos,
  });

  if (error) {
    // No interrumpe la compra (el pase ya existe igual) — solo se deja
    // constancia en los logs del servidor para poder diagnosticarlo.
    console.error("Error enviando el email de pases:", error);
  }
}
