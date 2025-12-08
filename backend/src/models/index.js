// src/models/index.js
import { Pedido } from '../models/Pedido.js';
import { DetallePedido } from '../models/DetallePedido.js';
import { Pago } from '../models/Pago.js';
import { Producto } from '../models/Producto.js';

// Muy importante: esto ejecuta las asociaciones
import './associations.js';

export {
  Pedido,
  DetallePedido,
  Pago,
  Producto
};
