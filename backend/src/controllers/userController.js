import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import nodemailer from 'nodemailer';
import { User } from '../models/User.js';
import dotenv from 'dotenv';
dotenv.config();

//Configurar envio de correos
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

//REGISTRO DE USUARIO
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
        html:  `
      <div style="font-family: Arial, sans-serif; background-color:#f5f5f5; padding:20px;">
        <div style="max-width:600px; margin:0 auto; background:white; border-radius:8px; padding:24px; box-shadow:0 2px 8px rgba(0,0,0,0.06);">
          
          <h2 style="color:#198754; margin-top:0; text-align:center;">
            🛒 ShopFast
          </h2>

          <p>Hola <strong>${nombre}</strong>,</p>

          <p>
            Gracias por registrarte en <strong>ShopFast</strong>. Antes de poder usar tu cuenta,
            necesitamos que confirmes tu dirección de correo electrónico.
          </p>

          <div style="text-align:center; margin:24px 0;">
            <a href="${verificationLink}"
               style="
                 display:inline-block;
                 padding:12px 24px;
                 background-color:#198754;
                 color:#ffffff;
                 text-decoration:none;
                 border-radius:6px;
                 font-weight:bold;
               ">
              Verificar mi cuenta
            </a>
          </div>

          <p style="font-size:14px; color:#555;">
            Si el botón no funciona, copia y pega el siguiente enlace en tu navegador:
          </p>

          <p style="font-size:13px; color:#007bff; word-break:break-all;">
            <a href="${verificationLink}">${verificationLink}</a>
          </p>

          <hr style="border:none; border-top:1px solid #eee; margin:24px 0;" />

          <p style="font-size:12px; color:#999; text-align:center;">
            Si tú no has creado esta cuenta, puedes ignorar este mensaje.
          </p>
        </div>
      </div>
    `
      });

      console.log(`📧 Correo de verificación enviado a ${email}`);
    } catch (mailError) {
      // No se detiene el registro si el correo falla
      console.warn(`⚠️ Error enviando correo a ${email}:`, mailError.message);
    }

    // Respuesta al frontend (éxito incluso si el correo falla)
    res.status(200).json({
      msg: 'Usuario registrado correctamente. Revisa tu correo para confirmar tu cuenta.'
    });

  } catch (error) {
    console.error('❌ Error al registrar el usuario:', error.message);
    res.status(500).json({ msg: 'Error al registrar el usuario', error: error.message });
  }
};

//VERIFICAR USUARIO
export const verifyEmail = async (req, res) => {
  try {
    const { token } = req.params;
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findByPk(decoded.id);

    if (!user) return res.status(400).send('<h2>❌ Usuario no encontrado.</h2>');

    user.verificado = true;
    await user.save();

    res.send(`
       <div class="container text-center my-5">
      <h2>✅ Tu cuenta ha sido verificada correctamente.</h2>
      <p>Ya puedes iniciar sesión en <a href="http://localhost:4200/login">ShopFast</a>.</p>
    </div>
    `);
  } catch (error) {
    console.error('❌ Error al verificar cuenta:', error.message);
    res.status(400).send('<h2>❌ Enlace inválido o expirado.</h2>');
  }
};

// LOGIN DE USUARIO
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

// 👉 Obtener perfil del usuario logueado
export const getProfile = async (req, res) => {
  try {
    const userId = req.user.id || req.user.id_usuario;   // por si el token tiene id_usuario

    const userDb = await User.findByPk(userId, {
      attributes: ['id_usuario', 'nombre', 'email', 'telefono', 'direccion']
    });

    if (!userDb) {
      return res.status(404).json({ msg: 'Usuario no encontrado' });
    }

    res.json(userDb);
  } catch (error) {
    console.error('Error obteniendo perfil:', error);
    res.status(500).json({ msg: 'Error obteniendo perfil' });
  }
};
// 🔥 Actualizar IMAGEN de perfil
export const actualizarImagenPerfil = async (req, res) => {
  try {
    const userId = req.user.id;

    if (!req.file) {
      return res.status(400).json({ msg: 'No se ha enviado ninguna imagen' });
    }

    // ruta que guardamos en BD (igual que con productos)
    const rutaImagen = `/uploads/${req.file.filename}`;

    const usuario = await User.findByPk(userId);
    if (!usuario) {
      return res.status(404).json({ msg: 'Usuario no encontrado' });
    }

    usuario.imagen = rutaImagen;
    await usuario.save();

    res.json({
      msg: 'Imagen de perfil actualizada correctamente',
      imagen: rutaImagen,
    });
  } catch (error) {
    console.error('❌ Error actualizarImagenPerfil:', error);
    res.status(500).json({ msg: 'Error al actualizar imagen de perfil', error: error.message });
  }
};

// 👉 Actualizar perfil del usuario logueado
export const updateProfile = async (req, res) => {
  const { nombre, telefono, direccion } = req.body;

  try {
    const userId = req.user.id || req.user.id_usuario;   // 👈 clave

    console.log('updateProfile -> req.user =', req.user);
    console.log('updateProfile -> userId =', userId);

    const [updated] = await User.update(
      { nombre, telefono, direccion },
      {
        where: { id_usuario: userId }    // 👈 usa SIEMPRE id_usuario (como en la SELECT)
      }
    );

    if (!updated) {
      return res.status(404).json({ msg: 'Usuario no encontrado' });
    }

    res.json({ msg: 'Perfil actualizado correctamente' });
  } catch (error) {
    console.error('Error actualizando perfil:', error);
    res.status(500).json({ msg: 'Error actualizando perfil' });
  }
};

