// Importo la conexión Sequelize para poder usar transacciones.
// Las transacciones me permiten asegurar que si algo sale mal durante el checkout,
// todo se revierte y no dejo datos inconsistentes en la BD.
import { sequelize } from '../config/db.js';

// Importo todos los modelos necesarios:
// - Carrito y CarritoItem → lo que el usuario quiere comprar
// - Pedido y DetallePedido → lo que realmente se crea como compra
// - Pago → registro del pago
// - Producto → para validar y usar precios si hiciera falta
import { Carrito, CarritoItem, Pedido, DetallePedido, Pago, Producto } from '../models/index.js';



// ====================================================================
// 🟢 startCheckout → CREA un pedido a partir del carrito del usuario
// ====================================================================
export const startCheckout = async (req, res) => {

  // Inicio una transacción manual porque aquí hay muchos pasos.
  // Si alguno falla → se hace rollback.
  const t = await sequelize.transaction();

  try {
    // Busco el carrito del usuario, o lo creo si aún no existiera.
    const [carrito] = await Carrito.findOrCreate({
      where: { id_usuario: req.user.id },
      transaction: t
    });

    // Busco todos los items dentro del carrito
    const items = await CarritoItem.findAll({
      where: { id_carrito: carrito.id_carrito },
      transaction: t
    });

    // Si no hay productos en el carrito, no puedo hacer un pedido.
    if (items.length === 0)
      return res.status(400).json({ msg: 'Carrito vacío' });

    // Calculo el total del pedido sumando precio_unitario * cantidad por cada item
    const total = items.reduce((acc, it) =>
      acc + (Number(it.precio_unitario) * it.cantidad),
    0);

    // Creo el pedido principal en estado "pendiente"
    const pedido = await Pedido.create({
      id_usuario: req.user.id,
      total,
      estado: 'pendiente'
    }, { transaction: t });

    // Ahora creo un detalle por cada item del carrito
    for (const it of items) {
      await DetallePedido.create({
        id_pedido: pedido.id_pedido,
        id_producto: it.id_producto,
        cantidad: it.cantidad,
        precio_unitario: it.precio_unitario
      }, { transaction: t });
    }

    // Una vez creado el pedido, vacío el carrito
    await CarritoItem.destroy({
      where: { id_carrito: carrito.id_carrito },
      transaction: t
    });

    // Si todo va bien → confirmo la transacción
    await t.commit();

    res.status(201).json({
      msg: 'Pedido creado',
      pedido
    });

  } catch (e) {

    // Si algo falla → revierto todos los cambios
    await t.rollback();

    res.status(500).json({
      msg: 'Error en checkout',
      error: e.message
    });
  }
};



// ====================================================================
// 🟡 confirmMockPayment → PAGO SIMULADO (para pruebas sin PayPal)
// ====================================================================
export const confirmMockPayment = async (req, res) => {

  const { id_pedido } = req.body;

  // Busco el pedido que se quiere pagar
  const pedido = await Pedido.findByPk(id_pedido);
  if (!pedido)
    return res.status(404).json({ msg: 'Pedido no encontrado' });

  // Registro el pago como si fuera real
  await Pago.create({
    id_pedido,
    metodo: 'mock', // es un pago falso para modo test
    estado: 'aprobado',
    transaccion_id: 'MOCK-' + Date.now()
  });

  // Cambio el estado del pedido a pagado
  pedido.estado = 'pagado';
  await pedido.save();

  res.json({
    msg: 'Pago simulado aprobado',
    pedido
  });
};



// ====================================================================
// 🅰️ PayPal Sandbox (solo estructura para activar más tarde)
// ====================================================================
export const createPayPalOrder = async (req, res) => {

  // Aquí iría la llamada al SDK de PayPal para crear una orden real.
  // De momento devuelvo datos falsos para pruebas.
  res.json({
    orderId: 'TEST_ORDER_ID',
    approvalUrl: 'https://www.sandbox.paypal.com/checkoutnow?token=TEST_ORDER_ID'
  });
};



// ====================================================================
// 🅱️ Capturar pago PayPal (sandbox)
// ====================================================================
export const capturePayPalOrder = async (req, res) => {

  const { id_pedido, orderId } = req.body;

  // Verifico que el pedido existe
  const pedido = await Pedido.findByPk(id_pedido);
  if (!pedido)
    return res.status(404).json({ msg: 'Pedido no encontrado' });

  // Registro el pago como aprobado
  await Pago.create({
    id_pedido,
    metodo: 'paypal',
    estado: 'aprobado',
    transaccion_id: orderId
  });

  // Marco pedido como pagado
  pedido.estado = 'pagado';
  await pedido.save();

  res.json({
    msg: 'Pago PayPal (sandbox) aprobado',
    pedido
  });
};
