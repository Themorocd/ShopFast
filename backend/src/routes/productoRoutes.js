import express from 'express';
import { crearProducto, listarProductos, actualizarProducto, eliminarProducto } from '../controllers/productoController.js';
import upload from '../middleware/upload.js';
import { verifyToken } from '../middleware/authMiddleware.js';

const router = express.Router();

// Rutas CRUD protegidas con token (solo usuarios logueados)
router.post('/', verifyToken, crearProducto);
router.get('/', listarProductos);
router.put('/:id', verifyToken, actualizarProducto);
router.delete('/:id', verifyToken, eliminarProducto);
router.post('/', verifyToken, upload.single('imagen'), crearProducto);
router.put('/:id', verifyToken, upload.single('imagen'), actualizarProducto);

export default router;
