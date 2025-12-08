import { Pedido } from './Pedido.js';
import { DetallePedido } from './DetallePedido.js';
import { Pago } from './Pago.js';
import { Producto } from './Producto.js';
// importa también User, Carrito, etc., si los usas

// Pedido 1:1 Pago
Pedido.hasOne(Pago, { foreignKey: 'id_pedido', as: 'Pago' });
Pago.belongsTo(Pedido, { foreignKey: 'id_pedido', as: 'Pedido' });

// Pedido 1:N DetallePedido
Pedido.hasMany(DetallePedido, { foreignKey: 'id_pedido', as: 'DetallePedidos' });
DetallePedido.belongsTo(Pedido, { foreignKey: 'id_pedido', as: 'Pedido' });

// Producto 1:N DetallePedido
Producto.hasMany(DetallePedido, { foreignKey: 'id_producto', as: 'DetallesProducto' });
DetallePedido.belongsTo(Producto, { foreignKey: 'id_producto', as: 'Producto' });
