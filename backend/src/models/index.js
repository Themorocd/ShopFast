// src/models/index.js

// =======================================================================
// 📦 IMPORTO TODOS LOS MODELOS PRINCIPALES DE MI APLICACIÓN
// =======================================================================
// Aquí importo los modelos que quiero exportar juntos desde un único archivo.
// Esto hace que el código sea más limpio y permite hacer:
// import { Producto, Pedido } from '../models/index.js'
// en lugar de importar uno por uno desde su ruta.
import { Pedido } from '../models/Pedido.js';
import { DetallePedido } from '../models/DetallePedido.js';
import { Pago } from '../models/Pago.js';
import { Producto } from '../models/Producto.js';

// =======================================================================
// 🔗 IMPORTANTE: CARGO LAS ASOCIACIONES ENTRE MODELOS
// =======================================================================
// Este archivo importa y ejecuta la configuración de asociaciones.
// Con esto Sequelize entiende las relaciones:
// - Pedido → Pago
// - Pedido → DetallePedido
// - Producto → DetallePedido
// Si NO importara este archivo, las relaciones no existirían.
import './associations.js';

// =======================================================================
// 🚀 EXPORTO TODOS LOS MODELOS JUNTOS
// =======================================================================
// Así, cualquier archivo del backend puede importar desde aquí
// todos los modelos relacionados con pedidos.
export {
  Pedido,
  DetallePedido,
  Pago,
  Producto
};
