// src/controllers/paymentController.js
import { createPayPalOrder, capturePayPalOrder } from '../services/paypalService.js';
import { crearPedidoYRegistroPago } from './orderController.js'; // si la exportas

// 1) Crear orden PayPal (frontal no toca PayPal directo)
export const crearOrdenPayPal = async (req, res) => {
  try {
    const { items } = req.body;
    const userId = req.user.id;

    if (!items || !Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ msg: 'Carrito vacío o datos incorrectos' });
    }

    const total = items.reduce(
      (acc, it) => acc + Number(it.precio) * it.quantity,
      0
    );

    // Crear orden en PayPal (SANDBOX)
    const order = await createPayPalOrder(total);

    // Puedes guardar temporalmente info si quieres, pero de momento solo devolvemos el orderId
    res.json({
      orderId: order.id
    });
  } catch (error) {
    console.error('Error creando orden PayPal:', error.response?.data || error.message);
    res.status(500).json({ msg: 'Error creando orden PayPal' });
  }
};

// 2) Capturar pago PayPal y crear Pedido en nuestra BD
export const capturarPagoPayPal = async (req, res) => {
  try {
    const { orderId, items } = req.body;
    const userId = req.user.id;

    if (!orderId) {
      return res.status(400).json({ msg: 'Falta orderId' });
    }
    if (!items || !Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ msg: 'Carrito vacío o datos incorrectos' });
    }

    // Llamar a PayPal para capturar el pago (SANDBOX)
    const captureData = await capturePayPalOrder(orderId);

    // Normalmente hay algo así:
    // captureData.purchase_units[0].payments.captures[0].id
    const captureId =
      captureData?.purchase_units?.[0]?.payments?.captures?.[0]?.id || null;

    // Crear pedido + pago en nuestra BD usando la misma lógica
    const resultado = await crearPedidoYRegistroPago(
      userId,
      items,
      'paypal',
      'aprobado',
      captureId || `PAYPAL-${orderId}`
    );

    res.status(201).json({
      msg: 'Pago PayPal capturado y pedido creado',
      ...resultado
    });
  } catch (error) {
    console.error('Error capturando pago PayPal:', error.response?.data || error.message);
    res.status(500).json({ msg: 'Error capturando pago PayPal' });
  }
};
