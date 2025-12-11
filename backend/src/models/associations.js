import { Pedido } from './Pedido.js';
import { DetallePedido } from './DetallePedido.js';
import { Pago } from './Pago.js';
import { Producto } from './Producto.js';
// (Aquí también podría importar User, Carrito, CarritoItem, etc., si los uso)

// =======================================================================
// 🟢 RELACIÓN 1:1 → Pedido tiene un Pago
// =======================================================================
// Un pedido solo puede tener un registro de pago asociado (PayPal, mock, etc.)
// y cada pago pertenece exactamente a un pedido.
Pedido.hasOne(Pago, {
  foreignKey: 'id_pedido',   // columna en la tabla pagos
  as: 'Pago'                 // alias que usaré en los include del controlador
});

Pago.belongsTo(Pedido, {
  foreignKey: 'id_pedido',
  as: 'Pedido'
});


// =======================================================================
// 🔵 RELACIÓN 1:N → Pedido tiene muchos DetallePedido
// =======================================================================
// Cada pedido puede contener varios productos distintos (líneas de pedido).
// Pero cada DetallePedido pertenece únicamente a un pedido.
Pedido.hasMany(DetallePedido, {
  foreignKey: 'id_pedido',      // clave foránea en DetallePedido
  as: 'DetallePedidos'          // alias para incluir detalles en getMyOrders
});

DetallePedido.belongsTo(Pedido, {
  foreignKey: 'id_pedido',
  as: 'Pedido'
});


// =======================================================================
// 🔴 RELACIÓN 1:N → Producto tiene muchos DetallePedido
// =======================================================================
// Un producto puede aparecer en muchos pedidos distintos.
// Pero cada DetallePedido hace referencia a un solo producto.
Producto.hasMany(DetallePedido, {
  foreignKey: 'id_producto',
  as: 'DetallesProducto'        // alias útil si quiero ver todos los pedidos donde aparece un producto
});

DetallePedido.belongsTo(Producto, {
  foreignKey: 'id_producto',
  as: 'Producto'                // alias que se usa para mostrar el nombre del producto en los pedidos
});
