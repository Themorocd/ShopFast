import express from 'express';
import { pagarSimulado } from '../controllers/orderController.js';
import { verifyToken } from '../middleware/authMiddleware.js';

const router = express.Router();

// Ruta para pago simulado
router.post('/simulated-pay', verifyToken, pagarSimulado);

export default router;
