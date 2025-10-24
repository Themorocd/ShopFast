import express from 'express';
import { register, verifyEmail, login } from '../controllers/userController.js';

const router = express.Router();

router.post('/register', register);
router.post('/login', login); // 👈 Nueva ruta
router.get('/verify/:token', verifyEmail);

import { verifyToken } from '../middleware/authMiddleware.js';
router.get('/perfil', verifyToken, (req, res) => {
  res.json({ msg: 'Bienvenido al perfil protegido', user: req.user });
});

export default router;
