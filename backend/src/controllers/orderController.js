// src/controllers/orderController.js
import { sequelize } from '../config/db.js';
import { Pedido, DetallePedido, Pago, Producto } from '../models/index.js';

// 👇 Función reutilizable para crear Pedido + Detalles + Pago
export const crearPedidoYRegistroPago = async (userId, items, metodo, estadoPago, transaccionId) => {
  const t = await sequelize.transaction();
  try {
    // 1) Calcular total
    const total = items.reduce(
      (acc, it) => acc + Number(it.precio) * it.quantity,
      0
    );

    // 2) Crear pedido
    const pedido = await Pedido.create(
      {
        id_usuario: userId,
        total,
        estado: 'pagado' // si llega aquí suponemos pago OK
      },
      { transaction: t }
    );

    // 3) Crear detalles de pedido
    for (const it of items) {
      await DetallePedido.create(
        {
          id_pedido: pedido.id_pedido,
          id_producto: it.id_producto,
          cantidad: it.quantity,
          precio_unitario: it.precio
        },
        { transaction: t }
      );
    }

    // 4) Crear registro en la tabla pagos
    await Pago.create(
      {
        id_pedido: pedido.id_pedido,
        metodo,               // 'mock' o 'paypal'
        estado: estadoPago,   // 'aprobado', 'creado', etc.
        transaccion_id: transaccionId
      },
      { transaction: t }
    );

    await t.commit();

    return { ok: true, pedido, total, transaccionId };
  } catch (error) {
    await t.rollback();
    throw error;
  }
};

// 🧾 PAGO SIMULADO (mock) – ahora usando la función
export const pagarSimulado = async (req, res) => {
  const { items } = req.body;
  const userId = req.user.id;

  if (!items || !Array.isArray(items) || items.length === 0) {
    return res.status(400).json({ msg: 'Carrito vacío o datos incorrectos' });
  }

  try {
    const transaccionId = 'MOCK-' + Date.now();

    const resultado = await crearPedidoYRegistroPago(
      userId,
      items,
      'mock',
      'aprobado',
      transaccionId
    );

    res.status(201).json({
      msg: 'Pedido creado y pago simulado registrado',
      ...resultado
    });
  } catch (error) {
    console.error('Error en pago simulado:', error);
    res.status(500).json({ msg: 'Error en pago simulado', error: error.message });
  }
};

export const getMyOrders = async (req, res) => {
  const userId = req.user.id; // viene del token JWT

  try {
    console.log('Asociaciones de Pedido:', Object.keys(Pedido.associations));
    const pedidos = await Pedido.findAll({
      where: { id_usuario: userId },
      include: [
        {
          model: Pago,
          as: 'Pago', // 👈 alias igual que en associations
          attributes: ['metodo', 'estado', 'transaccion_id']
        },
        {
          model: DetallePedido,
          as: 'DetallePedidos', // 👈 alias igual que en associations
          include: [
            {
              model: Producto,
              as: 'Producto', // 👈 alias igual que en associations
              attributes: ['nombre']
            }
          ]
        }
      ],
      order: [['id_pedido', 'DESC']]
    });

    res.json(pedidos);
  } catch (error) {
    console.error('Error obteniendo pedidos del usuario:', error);
    res.status(500).json({ msg: 'Error obteniendo pedidos', error: error.message });
  }
};
