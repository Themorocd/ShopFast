import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import nodemailer from 'nodemailer';
import { User } from '../models/User.js';
import dotenv from 'dotenv';
dotenv.config();

// 📩 Configurar transporte de correos
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

// 🧾 REGISTRO DE USUARIO
export const register = async (req, res) => {
  try {
    const { nombre, email, password } = req.body;

    // Verificar si el usuario ya existe
    const userExist = await User.findOne({ where: { email } });
    if (userExist) return res.status(400).json({ msg: 'El usuario ya existe.' });

    // Encriptar contraseña
    const hashedPassword = await bcrypt.hash(password, 10);

    // Crear usuario en BD con campo verificado = false por defecto
    const newUser = await User.create({
      nombre,
      email,
      password: hashedPassword,
      verificado: false
    });

    // Crear token de verificación
    const token = jwt.sign({ id: newUser.id_usuario }, process.env.JWT_SECRET, { expiresIn: '1d' });

    // Enlace de verificación
    const verificationLink = `http://localhost:3000/api/users/verify/${token}`;

    // Intentar enviar correo
    try {
      await transporter.sendMail({
        from: `"ShopFast" <${process.env.EMAIL_USER}>`,
        to: email,
        subject: 'Verifica tu cuenta en ShopFast',
        html: `
          <h2>¡Hola ${nombre}!</h2>
          <p>Gracias por registrarte en <b>ShopFast</b>. Para activar tu cuenta, haz clic en el siguiente enlace:</p>
          <a href="${verificationLink}" target="_blank">Verificar mi cuenta</a>
          <br><br>
          <p>Este enlace expirará en 24 horas.</p>
        `
      });

      console.log(`📧 Correo de verificación enviado a ${email}`);
    } catch (mailError) {
      // No detenemos el registro si el correo falla
      console.warn(`⚠️ Error enviando correo a ${email}:`, mailError.message);
    }

    // Respuesta al frontend (éxito incluso si el correo falló)
    res.status(200).json({
      msg: 'Usuario registrado correctamente. Revisa tu correo para confirmar tu cuenta.'
    });

  } catch (error) {
    console.error('❌ Error al registrar el usuario:', error.message);
    res.status(500).json({ msg: 'Error al registrar el usuario', error: error.message });
  }
};

// ✅ VERIFICAR USUARIO
export const verifyEmail = async (req, res) => {
  try {
    const { token } = req.params;
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findByPk(decoded.id);

    if (!user) return res.status(400).send('<h2>❌ Usuario no encontrado.</h2>');

    user.verificado = true;
    await user.save();

    res.send(`
      <h2>✅ Tu cuenta ha sido verificada correctamente.</h2>
      <p>Ya puedes iniciar sesión en <a href="http://localhost:4200/login">ShopFast</a>.</p>
    `);
  } catch (error) {
    console.error('❌ Error al verificar cuenta:', error.message);
    res.status(400).send('<h2>❌ Enlace inválido o expirado.</h2>');
  }
};

// 🧾 LOGIN DE USUARIO
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Verificar si el usuario existe
    const user = await User.findOne({ where: { email } });
    if (!user) return res.status(400).json({ msg: 'El usuario no existe' });

    // Comparar contraseñas
    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) return res.status(400).json({ msg: 'Contraseña incorrecta' });

    // Verificar si está confirmado
    if (!user.verificado) {
      return res.status(400).json({ msg: 'Verifica tu cuenta antes de iniciar sesión' });
    }

    // Generar token JWT
    const token = jwt.sign(
      { id: user.id_usuario, rol: user.rol },
      process.env.JWT_SECRET,
      { expiresIn: '2h' }
    );

    res.json({
      msg: 'Inicio de sesión exitoso',
      token,
      usuario: {
        id: user.id_usuario,
        nombre: user.nombre,
        email: user.email,
        rol: user.rol
      }
    });
  } catch (error) {
    console.error('❌ Error al iniciar sesión:', error.message);
    res.status(500).json({ msg: 'Error al iniciar sesión', error: error.message });
  }
};
