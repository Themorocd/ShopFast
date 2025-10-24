import express from 'express';
import {
  listarProductos, crearProducto, actualizarProducto, eliminarProducto,
  listarCategorias, crearCategoria, actualizarCategoria, eliminarCategoria,
  listarProveedores, crearProveedor, actualizarProveedor, eliminarProveedor
} from '../controllers/adminController.js';

const router = express.Router();

// 🧩 Productos
router.get('/products', listarProductos);
router.post('/products', crearProducto);
router.put('/products/:id', actualizarProducto); // ✅ añadido
router.delete('/products/:id', eliminarProducto);

// 🧩 Categorías
router.get('/categories', listarCategorias);
router.post('/categories', crearCategoria);
router.put('/categories/:id', actualizarCategoria); // ✅ añadido
router.delete('/categories/:id', eliminarCategoria);

// 🧩 Proveedores
router.get('/suppliers', listarProveedores);
router.post('/suppliers', crearProveedor);
router.put('/suppliers/:id', actualizarProveedor); // ✅ añadido
router.delete('/suppliers/:id', eliminarProveedor);

export default router;

