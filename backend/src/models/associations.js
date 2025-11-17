// Carrito 1:N CarritoItem
Carrito.hasMany(CarritoItem, { foreignKey: 'id_carrito' });
CarritoItem.belongsTo(Carrito, { foreignKey: 'id_carrito' });

// Pedido 1:N DetallePedido
Pedido.hasMany(DetallePedido, { foreignKey: 'id_pedido' });
DetallePedido.belongsTo(Pedido, { foreignKey: 'id_pedido' });

// Pedido 1:1 Pago
Pedido.hasOne(Pago, { foreignKey: 'id_pedido' });
Pago.belongsTo(Pedido, { foreignKey: 'id_pedido' });
