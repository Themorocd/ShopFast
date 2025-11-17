// src/controllers/checkoutController.js
import { sequelize } from '../config/db.js';
import { Carrito, CarritoItem, Pedido, DetallePedido, Pago, Producto } from '../models/index.js';

export const startCheckout = async (req, res) => {
  const t = await sequelize.transaction();
  try {
    const [carrito] = await Carrito.findOrCreate({ where: { id_usuario: req.user.id }, transaction: t });
    const items = await CarritoItem.findAll({ where: { id_carrito: carrito.id_carrito }, transaction: t });
    if (items.length === 0) return res.status(400).json({ msg: 'Carrito vacío' });

    const total = items.reduce((acc, it) => acc + (Number(it.precio_unitario) * it.cantidad), 0);
    const pedido = await Pedido.create({ id_usuario: req.user.id, total, estado: 'pendiente' }, { transaction: t });

    for (const it of items) {
      await DetallePedido.create({
        id_pedido: pedido.id_pedido,
        id_producto: it.id_producto,
        cantidad: it.cantidad,
        precio_unitario: it.precio_unitario
      }, { transaction: t });
    }

    // Vaciar carrito
    await CarritoItem.destroy({ where: { id_carrito: carrito.id_carrito }, transaction: t });

    await t.commit();
    res.status(201).json({ msg: 'Pedido creado', pedido });
  } catch (e) {
    await t.rollback();
    res.status(500).json({ msg: 'Error en checkout', error: e.message });
  }
};

// Opción B: pago simulado (mock)
export const confirmMockPayment = async (req, res) => {
  const { id_pedido } = req.body;
  const pedido = await Pedido.findByPk(id_pedido);
  if (!pedido) return res.status(404).json({ msg: 'Pedido no encontrado' });

  await Pago.create({ id_pedido, metodo: 'mock', estado: 'aprobado', transaccion_id: 'MOCK-' + Date.now() });
  pedido.estado = 'pagado';
  await pedido.save();

  res.json({ msg: 'Pago simulado aprobado', pedido });
};

// Opción A: PayPal Sandbox (crear y capturar) -> si luego quieres activarlo:
export const createPayPalOrder = async (req, res) => {
  // Aquí crearías la orden vía SDK PayPal y devuelves el approvalUrl o id de la orden
  res.json({ orderId: 'TEST_ORDER_ID', approvalUrl: 'https://www.sandbox.paypal.com/checkoutnow?token=TEST_ORDER_ID' });
};

export const capturePayPalOrder = async (req, res) => {
  const { id_pedido, orderId } = req.body;
  // Aquí capturarías con el SDK; para modo test, lo marcamos como aprobado.
  const pedido = await Pedido.findByPk(id_pedido);
  if (!pedido) return res.status(404).json({ msg: 'Pedido no encontrado' });

  await Pago.create({ id_pedido, metodo: 'paypal', estado: 'aprobado', transaccion_id: orderId });
  pedido.estado = 'pagado';
  await pedido.save();
  res.json({ msg: 'Pago PayPal (sandbox) aprobado', pedido });
};
