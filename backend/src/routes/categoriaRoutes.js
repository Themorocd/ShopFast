import express from 'express';
import { crearCategoria, listarCategorias } from '../controllers/categoriaController.js';
import { verifyToken } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/', verifyToken, crearCategoria);
router.get('/', listarCategorias);

export default router;
