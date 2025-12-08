// src/routes/paymentRoutes.js
import express from 'express';
import { verifyToken } from '../middleware/authMiddleware.js';
import { crearOrdenPayPal, capturarPagoPayPal } from '../controllers/paymentController.js';

const router = express.Router();

router.post('/paypal/create-order', verifyToken, crearOrdenPayPal);
router.post('/paypal/capture', verifyToken, capturarPagoPayPal);

export default router;
