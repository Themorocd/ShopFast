import express from 'express';
import { crearProveedor, listarProveedores } from '../controllers/proveedorController.js';
import { verifyToken } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/', verifyToken, crearProveedor);
router.get('/', listarProveedores);

export default router;
