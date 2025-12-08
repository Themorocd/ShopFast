import express from 'express';
import { pagarSimulado, getMyOrders } from '../controllers/orderController.js';
import { verifyToken } from '../middleware/authMiddleware.js';

const router = express.Router();

// Pago simulado
router.post('/simulated-pay', verifyToken, pagarSimulado);

// Mis pedidos
router.get('/my', verifyToken, getMyOrders);

export default router;
