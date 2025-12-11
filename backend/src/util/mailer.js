import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: Number(process.env.SMTP_PORT) || 587,
  secure: false,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

export async function sendOrderConfirmationEmail(to, nombre, pedido) {
  const { items, total, transaccionId, fecha } = pedido;

  const rowsHtml = items
    .map(
      (item) => `
        <tr>
          <td style="padding:8px 12px; border-bottom:1px solid #eee;">
            ${item.nombre}
          </td>
          <td style="padding:8px 12px; border-bottom:1px solid #eee; text-align:center;">
            ${item.quantity}
          </td>
          <td style="padding:8px 12px; border-bottom:1px solid #eee; text-align:right;">
            ${Number(item.precio).toFixed(2)} €
          </td>
          <td style="padding:8px 12px; border-bottom:1px solid #eee; text-align:right;">
            ${(item.quantity * Number(item.precio)).toFixed(2)} €
          </td>
        </tr>
      `
    )
    .join('');

  const html = `
    <div style="font-family: Arial, sans-serif; background-color:#f5f5f5; padding:20px;">
      <div style="max-width:600px; margin:0 auto; background:white; border-radius:8px; padding:24px; box-shadow:0 2px 8px rgba(0,0,0,0.06);">
        
        <h2 style="color:#198754; margin-top:0; text-align:center;">
          🛒 ShopFast
        </h2>

        <p>Hola <strong>${nombre}</strong>,</p>

        <p>
          ¡Gracias por tu compra en <strong>ShopFast</strong>!  
          Te confirmamos que tu pedido ha sido <strong>ENVIADO</strong>.
        </p>

        <p style="font-size:14px; color:#555;">
          <strong>Fecha:</strong> ${fecha}<br/>
          <strong>ID de transacción:</strong> ${transaccionId}
        </p>

        <h3 style="margin-top:24px;">Resumen de tu pedido</h3>

        <table style="width:100%; border-collapse:collapse; margin-top:8px;">
          <thead>
            <tr>
              <th style="text-align:left; padding:8px 12px; border-bottom:2px solid #198754;">Producto</th>
              <th style="text-align:center; padding:8px 12px; border-bottom:2px solid #198754;">Cantidad</th>
              <th style="text-align:right; padding:8px 12px; border-bottom:2px solid #198754;">Precio</th>
              <th style="text-align:right; padding:8px 12px; border-bottom:2px solid #198754;">Subtotal</th>
            </tr>
          </thead>
          <tbody>
            ${rowsHtml}
          </tbody>
        </table>

        <p style="text-align:right; margin-top:16px; font-size:16px;">
          <strong>Total pagado: ${total.toFixed(2)} €</strong>
        </p>

        <p style="font-size:13px; color:#555; margin-top:24px;">
          Estado del pedido: <strong style="color:#198754;">Enviado</strong><br/>
          Recibirás otro correo cuando esté preparado para su entrega.
        </p>

        <hr style="border:none; border-top:1px solid #eee; margin:24px 0;" />

        <p style="font-size:12px; color:#999; text-align:center;">
          Si tienes cualquier duda, responde a este correo o visita tu área de pedidos en ShopFast.
        </p>
      </div>
    </div>
  `;

  await transporter.sendMail({
    from: '"ShopFast" <no-reply@shopfast.com>',
    to,
    subject: 'Confirmación de pedido - ShopFast',
    html,
  });
}
