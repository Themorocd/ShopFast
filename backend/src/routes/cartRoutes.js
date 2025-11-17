// src/routes/cartRoutes.js
import express from 'express';
import { authRequired } from '../middleware/authMiddleware.js';
import { getCart, addItem, updateItem, removeItem, clearCart } from '../controllers/cartController.js';
const router = express.Router();

router.use(authRequired); // requiere login para operar el carrito
router.get('/', getCart);
router.post('/items', addItem);
router.patch('/items/:id_item', updateItem);
router.delete('/items/:id_item', removeItem);
router.delete('/', clearCart);

export default router;
