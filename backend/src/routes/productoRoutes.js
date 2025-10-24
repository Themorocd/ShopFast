import express from 'express';
import { crearProducto, listarProductos, actualizarProducto, eliminarProducto } from '../controllers/productoController.js';
import { verifyToken } from '../middleware/authMiddleware.js';

const router = express.Router();

// Rutas CRUD protegidas con token (solo usuarios logueados)
router.post('/', verifyToken, crearProducto);
router.get('/', listarProductos);
router.put('/:id', verifyToken, actualizarProducto);
router.delete('/:id', verifyToken, eliminarProducto);

export default router;
