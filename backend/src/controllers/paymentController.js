// src/controllers/paymentController.js

// Importo Nodemailer para poder enviar correos electrónicos (confirmaciones de pedido, etc.)
import nodemailer from 'nodemailer';

// Importo las funciones que gestionan PayPal en mi servicio separado
import { createPayPalOrder, capturePayPalOrder } from '../services/paypalService.js';

// Importo mi propia función que registra pedido + detalles + registro del pago
import { crearPedidoYRegistroPago } from './orderController.js';

// Importo el modelo User para obtener el email y datos del cliente
import { User } from '../models/User.js';



// ======================================================================
// 📧 CONFIGURACIÓN DEL SERVIDOR DE CORREO (GMAIL)
// ======================================================================
// Aquí configuro Nodemailer para enviar emails usando Gmail.
// IMPORTANTE: Gmail requiere contraseña de aplicación.
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,  // correo desde el que envío
    pass: process.env.EMAIL_PASS,  // contraseña de aplicación de Gmail
  },
});



// ======================================================================
// 1️⃣ CREAR ORDEN PAYPAL — El usuario está en el checkout y pide pagar.
// ======================================================================
export const crearOrdenPayPal = async (req, res) => {
  try {
    const { items } = req.body;
    const userId = req.user.id;

    // Compruebo que haya productos válidos en el carrito
    if (!items || !Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ msg: 'Carrito vacío o datos incorrectos' });
    }

    // Calculo el total que se enviará a PayPal
    const total = items.reduce(
      (acc, it) => acc + Number(it.precio) * it.quantity,
      0
    );

    // Creo la orden en PayPal (MODO SANDBOX)
    const order = await createPayPalOrder(total);

    // Devuelvo el ID de la orden para que el frontal redirija al usuario a PayPal
    res.json({
      orderId: order.id,
    });

  } catch (error) {
    console.error(
      'Error creando orden PayPal:',
      error.response?.data || error.message
    );
    res.status(500).json({ msg: 'Error creando orden PayPal' });
  }
};



// ======================================================================
// 2️⃣ CAPTURAR PAGO PAYPAL → Confirmo que el usuario pagó correctamente
// ======================================================================
export const capturarPagoPayPal = async (req, res) => {
  try {
    const { orderId, items } = req.body;
    const userId = req.user.id;

    // Validaciones básicas
    if (!orderId) {
      return res.status(400).json({ msg: 'Falta orderId' });
    }
    if (!items || !Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ msg: 'Carrito vacío o datos incorrectos' });
    }

    // Capturo el pago en PayPal (SANDBOX)
    const captureData = await capturePayPalOrder(orderId);

    // Intento obtener el ID de la transacción de PayPal
    const captureId =
      captureData?.purchase_units?.[0]?.payments?.captures?.[0]?.id || null;

    // Guardo el pedido en mi BD, con sus detalles y su pago
    const resultado = await crearPedidoYRegistroPago(
      userId,
      items,
      'paypal',
      'aprobado',
      captureId || `PAYPAL-${orderId}`
    );

    // Calculo el total por si lo necesito en el correo
    const total = items.reduce(
      (acc, it) => acc + Number(it.precio) * it.quantity,
      0
    );



    // ======================================================================
    // 📧 MANDO CORREO DE CONFIRMACIÓN DE PEDIDO AL CLIENTe
    // ======================================================================
    try {
      const usuario = await User.findByPk(userId);

      if (usuario) {
        const fecha = new Date().toLocaleString('es-ES');
        const transaccionId = captureId || `PAYPAL-${orderId}`;

        // Construyo la tabla HTML con los productos
        const rowsHtml = items
          .map(item => `
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
          `)
          .join('');

        // Envío el correo al cliente con resumen del pedido
        await transporter.sendMail({
          from: `"ShopFast" <${process.env.EMAIL_USER}>`,
          to: usuario.email,
          subject: 'Confirmación de pedido - ShopFast',
          html: `
          <div style="font-family: Arial, sans-serif; background-color:#f5f5f5; padding:20px;">
            <div style="max-width:600px; margin:0 auto; background:white; border-radius:8px; padding:24px; box-shadow:0 2px 8px rgba(0,0,0,0.06);">
              
              <h2 style="color:#198754; margin-top:0; text-align:center;">
                🛒 ShopFast
              </h2>

              <p>Hola <strong>${usuario.nombre}</strong>,</p>
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
                <strong>Total: ${total.toFixed(2)} €</strong>
              </p>

              <p style="font-size:13px; color:#555; margin-top:24px;">
                Estado del pedido: <strong style="color:#198754;">Enviado</strong><br/>
                Recibirás otro correo cuando esté preparado para su entrega.
              </p>
            </div>
          </div>
          `,
        });

        console.log('✅ Email de confirmación enviado a:', usuario.email);
      }

    } catch (mailError) {
      console.error('❌ Error enviando correo de confirmación:', mailError);
      // No afecta al pedido; el usuario igual recibe confirmación por pantalla
    }



    // ======================================================================
    // RESPUESTA FINAL
    // ======================================================================
    res.status(201).json({
      msg: 'Pago PayPal capturado, pedido creado y correo enviado (si fue posible).',
      ...resultado,
    });

  } catch (error) {
    console.error(
      'Error capturando pago PayPal:',
      error.response?.data || error.message
    );
    res.status(500).json({ msg: 'Error capturando pago PayPal' });
  }
};
