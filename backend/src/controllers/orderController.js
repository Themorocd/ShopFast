import { sequelize } from '../config/db.js';
import { Pedido } from '../models/Pedido.js';
import { DetallePedido } from '../models/DetallePedido.js';
import { Pago } from '../models/Pago.js';

export const pagarSimulado = async (req, res) => {
  const { items } = req.body;  // items viene del frontend
  const userId = req.user.id;  // viene del token (verifyToken)

  if (!items || !Array.isArray(items) || items.length === 0) {
    return res.status(400).json({ msg: 'Carrito vacío o datos incorrectos' });
  }

  const t = await sequelize.transaction();
  try {
    // Calcular total
    const total = items.reduce(
      (acc, it) => acc + Number(it.precio) * it.quantity,
      0
    );

    // 1) Crear pedido
    const pedido = await Pedido.create(
      {
        id_usuario: userId,
        total,
        estado: 'pagado'   // como es simulado, lo marcamos ya pagado
      },
      { transaction: t }
    );

    // 2) Crear detalles de pedido
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

    // 3) Crear registro en la tabla pagos (simulado)
    const transaccionId = 'MOCK-' + Date.now();

    await Pago.create(
      {
        id_pedido: pedido.id_pedido,
        metodo: 'mock',
        estado: 'aprobado',
        transaccion_id: transaccionId
      },
      { transaction: t }
    );

    await t.commit();

    res.status(201).json({
      msg: 'Pedido creado y pago simulado registrado',
      pedido,
      transaccionId
    });
  } catch (error) {
    await t.rollback();
    console.error('Error en pago simulado:', error);
    res.status(500).json({ msg: 'Error en pago simulado', error: error.message });
  }
};
