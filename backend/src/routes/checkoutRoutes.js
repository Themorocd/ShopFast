// src/routes/checkoutRoutes.js
import express from 'express';
import { authRequired } from '../middleware/authMiddleware.js';
import { startCheckout, confirmMockPayment, createPayPalOrder, capturePayPalOrder } from '../controllers/checkoutController.js';
const router = express.Router();

router.use(authRequired);
router.post('/start', startCheckout);                  // crea pedido desde el carrito
router.post('/pay/mock/confirm', confirmMockPayment);  // opción B: pago simulado
router.post('/paypal/create', createPayPalOrder);      // opción A: PayPal sandbox
router.post('/paypal/capture', capturePayPalOrder);    // opción A: PayPal sandbox

export default router;
