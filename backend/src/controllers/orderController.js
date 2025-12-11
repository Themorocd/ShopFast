// src/controllers/orderController.js

// Importo la conexión de Sequelize para poder usar transacciones.
// Las transacciones me permiten asegurar que si algo falla al crear un pedido,
// se deshacen todos los cambios y no dejo datos a medias.
import { sequelize } from '../config/db.js';

// Importo los modelos que necesito para trabajar con los pedidos:
// - Pedido: la cabecera del pedido (total, usuario, estado...)
// - DetallePedido: las líneas del pedido (cada producto con su cantidad y precio)
// - Pago: información del pago realizado
// - Producto: por si necesito información adicional del producto
import { Pedido, DetallePedido, Pago, Producto } from '../models/index.js';


// =======================================================================
// 🧠 Función reutilizable: crearPedidoYRegistroPago
// =======================================================================
// Esta función centraliza toda la lógica de crear un pedido completo:
// 1) Calcula el total a partir de los items
// 2) Crea el pedido
// 3) Crea los detalles del pedido (las líneas)
// 4) Registra el pago en la tabla de pagos
// Todo dentro de una transacción para garantizar consistencia.
export const crearPedidoYRegistroPago = async (userId, items, metodo, estadoPago, transaccionId) => {
  // Inicio una transacción manual con Sequelize
  const t = await sequelize.transaction();

  try {
    // 1) Calcular el total del pedido: sumo precio * cantidad de cada item
    const total = items.reduce(
      (acc, it) => acc + Number(it.precio) * it.quantity,
      0
    );

    // 2) Crear el pedido principal
    //    Si llegamos aquí, asumimos que el pago está correcto, así que lo dejo como "pagado"
    const pedido = await Pedido.create(
      {
        id_usuario: userId,
        total,
        estado: 'pagado'
      },
      { transaction: t }
    );

    // 3) Crear los detalles de pedido: uno por cada producto comprado
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

    // 4) Registrar el pago en la tabla Pagos
    await Pago.create(
      {
        id_pedido: pedido.id_pedido,
        metodo,             // tipo de pago: 'mock', 'paypal', etc.
        estado: estadoPago, // por ejemplo 'aprobado'
        transaccion_id: transaccionId
      },
      { transaction: t }
    );

    // Si todo ha ido bien, confirmo la transacción
    await t.commit();

    // Devuelvo información útil a quien llame a esta función
    return { ok: true, pedido, total, transaccionId };

  } catch (error) {
    // Si ocurre cualquier error, deshago todo lo que se haya hecho en la transacción
    await t.rollback();
    // Lanzo el error para que lo gestione quien llamó a la función
    throw error;
  }
};


// =======================================================================
// 🧾 pagarSimulado → Pago mock (para pruebas sin pasarela real)
// =======================================================================
// Esta ruta simula un pago correcto, usando la función crearPedidoYRegistroPago.
// Ideal para pruebas mientras no se integra la pasarela real.
export const pagarSimulado = async (req, res) => {
  const { items } = req.body;
  const userId = req.user.id; // id del usuario autenticado (viene del JWT)

  // Valido que lleguen items en el body y que sea un array con datos
  if (!items || !Array.isArray(items) || items.length === 0) {
    return res.status(400).json({ msg: 'Carrito vacío o datos incorrectos' });
  }

  try {
    // Genero un ID de transacción simulada
    const transaccionId = 'MOCK-' + Date.now();

    // Llamo a mi función reutilizable que crea el pedido + detalles + pago
    const resultado = await crearPedidoYRegistroPago(
      userId,
      items,
      'mock',         // método de pago simulado
      'aprobado',     // estado del pago
      transaccionId
    );

    // Devuelvo respuesta de éxito al frontend
    res.status(201).json({
      msg: 'Pedido creado y pago simulado registrado',
      ...resultado
    });

  } catch (error) {
    console.error('Error en pago simulado:', error);
    res.status(500).json({
      msg: 'Error en pago simulado',
      error: error.message
    });
  }
};


// =======================================================================
// 📦 getMyOrders → Obtener todos los pedidos del usuario logueado
// =======================================================================
// Esta ruta devuelve todos los pedidos del usuario, incluyendo:
// - Información del pago
// - Detalles del pedido
// - Información básica del producto (nombre)
export const getMyOrders = async (req, res) => {
  const userId = req.user.id; // id del usuario sacado del token JWT

  try {
    // Esto es útil si quiero ver en consola qué asociaciones tiene el modelo Pedido
    console.log('Asociaciones de Pedido:', Object.keys(Pedido.associations));

    const pedidos = await Pedido.findAll({
      where: { id_usuario: userId },
      include: [
        {
          model: Pago,
          as: 'Pago', // alias usado en las asociaciones del modelo Pedido
          attributes: ['metodo', 'estado', 'transaccion_id']
        },
        {
          model: DetallePedido,
          as: 'DetallePedidos', // alias definido en las asociaciones
          include: [
            {
              model: Producto,
              as: 'Producto', // alias definido en las asociaciones
              attributes: ['nombre'] // solo devuelvo el nombre del producto
            }
          ]
        }
      ],
      // Ordeno los pedidos para que los más recientes aparezcan primero
      order: [['id_pedido', 'DESC']]
    });

    // Devuelvo todos los pedidos del usuario con su información relacionada
    res.json(pedidos);

  } catch (error) {
    console.error('Error obteniendo pedidos del usuario:', error);
    res.status(500).json({
      msg: 'Error obteniendo pedidos',
      error: error.message
    });
  }
};
