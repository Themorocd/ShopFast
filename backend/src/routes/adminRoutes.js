import express from 'express';
import {
  listarProductos, crearProducto, actualizarProducto, eliminarProducto,
  listarCategorias, crearCategoria, actualizarCategoria, eliminarCategoria,
  listarProveedores, crearProveedor, actualizarProveedor, eliminarProveedor
} from '../controllers/adminController.js';

const router = express.Router();

//Productos
router.get('/products', listarProductos);
router.post('/products', crearProducto);
router.put('/products/:id', actualizarProducto); 
router.delete('/products/:id', eliminarProducto);

//Categorías
router.get('/categories', listarCategorias);
router.post('/categories', crearCategoria);
router.put('/categories/:id', actualizarCategoria); 
router.delete('/categories/:id', eliminarCategoria);

//Proveedores
router.get('/suppliers', listarProveedores);
router.post('/suppliers', crearProveedor);
router.put('/suppliers/:id', actualizarProveedor);
router.delete('/suppliers/:id', eliminarProveedor);

export default router;

