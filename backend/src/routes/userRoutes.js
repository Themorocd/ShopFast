import express from 'express';
import upload from '../middleware/upload.js';
import { register, verifyEmail, login, getProfile, actualizarImagenPerfil, updateProfile } from '../controllers/userController.js';

const router = express.Router();

router.post('/register', register);
router.post('/login', login);
router.get('/verify/:token', verifyEmail);
router.get('/profile', verifyToken, getProfile);
router.put('/profile', verifyToken, updateProfile);
router.put('/profile/image', verifyToken, upload.single('imagen'), actualizarImagenPerfil);


import { verifyToken } from '../middleware/authMiddleware.js';
router.get('/perfil', verifyToken, (req, res) => {
  res.json({ msg: 'Bienvenido al perfil protegido', user: req.user });
});

export default router;
