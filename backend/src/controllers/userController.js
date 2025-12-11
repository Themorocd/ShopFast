
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import nodemailer from 'nodemailer';
import { User } from '../models/User.js';
import dotenv from 'dotenv';

dotenv.config();


// ===================================================================
// 📧 CONFIGURACIÓN DE NODEMAILER (GMAIL)
// ===================================================================
// Aquí configuro el transporte de correo para poder enviar emails
// (verificación de cuenta, etc.) usando Gmail y una contraseña de aplicación.
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER, // correo desde el que se envían los emails
    pass: process.env.EMAIL_PASS  // contraseña de aplicación de Gmail
  }
});


// ===================================================================
// 🟢 REGISTRO DE USUARIO
// ===================================================================
// Esta función registra un nuevo usuario, encripta la contraseña
// y le envía un correo con un enlace de verificación.
export const register = async (req, res) => {
  try {
    const { nombre, email, password } = req.body;

    // 1) Comprobar si el usuario ya existe por email
    const userExist = await User.findOne({ where: { email } });
    if (userExist) {
      return res.status(400).json({ msg: 'El usuario ya existe.' });
    }

    // 2) Encriptar la contraseña antes de guardarla
    const hashedPassword = await bcrypt.hash(password, 10);

    // 3) Crear el usuario en la BD con verificado = false
    const newUser = await User.create({
      nombre,
      email,
      password: hashedPassword,
      verificado: false
    });

    // 4) Generar un token de verificación con JWT que expira en 1 día
    const token = jwt.sign(
      { id: newUser.id_usuario },
      process.env.JWT_SECRET,
      { expiresIn: '1d' }
    );

    // 5) Construir el enlace de verificación que se enviará por correo
    const verificationLink = `http://localhost:3000/api/users/verify/${token}`;

    // 6) Intentar enviar el correo de verificación
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
      // Si falla el envío del email, lo registro pero NO cancelo el registro
      console.warn(`⚠️ Error enviando correo a ${email}:`, mailError.message);
    }

    // 7) Respuesta al frontend (el usuario queda registrado,
    //    aunque el correo de verificación pudiera fallar)
    res.status(200).json({
      msg: 'Usuario registrado correctamente. Revisa tu correo para confirmar tu cuenta.'
    });

  } catch (error) {
    console.error('❌ Error al registrar el usuario:', error.message);
    res.status(500).json({
      msg: 'Error al registrar el usuario',
      error: error.message
    });
  }
};


// ===================================================================
// ✅ VERIFICAR EMAIL DEL USUARIO
// ===================================================================
// Esta función se ejecuta cuando el usuario hace clic en el enlace
// que le llega al correo. Marca su cuenta como verificada.
export const verifyEmail = async (req, res) => {
  try {
    const { token } = req.params;

    // 1) Verificar el token con JWT
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // 2) Buscar el usuario por el id que venía dentro del token
    const user = await User.findByPk(decoded.id);

    if (!user) {
      return res.status(400).send('<h2>❌ Usuario no encontrado.</h2>');
    }

    // 3) Marcar al usuario como verificado y guardar
    user.verificado = true;
    await user.save();

    // 4) Respuesta sencilla en HTML (puede mejorarse con plantilla)
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


// ===================================================================
// 🔐 LOGIN DE USUARIO
// ===================================================================
// Comprueba el email y contraseña, verifica que la cuenta esté confirmada
// y genera un token JWT para el usuario.
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // 1) Verificar si el usuario existe
    const user = await User.findOne({ where: { email } });
    if (!user) {
      return res.status(400).json({ msg: 'El usuario no existe' });
    }

    // 2) Comparar la contraseña recibida con la encriptada en BD
    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) {
      return res.status(400).json({ msg: 'Contraseña incorrecta' });
    }

    // 3) Verificar si el usuario ha confirmado su correo
    if (!user.verificado) {
      return res.status(400).json({ msg: 'Verifica tu cuenta antes de iniciar sesión' });
    }

    // 4) Generar el JWT con el id y rol del usuario
    const token = jwt.sign(
      { id: user.id_usuario, rol: user.rol },
      process.env.JWT_SECRET,
      { expiresIn: '2h' }  // el token caduca en 2 horas
    );

    // 5) Respuesta con token y datos básicos del usuario
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
    res.status(500).json({
      msg: 'Error al iniciar sesión',
      error: error.message
    });
  }
};


// ===================================================================
// 👤 OBTENER PERFIL DEL USUARIO LOGUEADO
// ===================================================================
export const getProfile = async (req, res) => {
  try {
    // Dependiendo de cómo se haya generado el token, el id puede venir como id o id_usuario
    const userId = req.user.id || req.user.id_usuario;

    // Busco al usuario en BD y solo devuelvo ciertos campos
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


// ===================================================================
// 🖼️ ACTUALIZAR IMAGEN DE PERFIL
// ===================================================================
// Esta función actualiza solo la imagen de perfil del usuario logueado.
// La imagen llega a través de Multer en req.file.
export const actualizarImagenPerfil = async (req, res) => {
  try {
    const userId = req.user.id;

    // Si no se ha mandado ningún archivo
    if (!req.file) {
      return res.status(400).json({ msg: 'No se ha enviado ninguna imagen' });
    }

    // Ruta que voy a guardar en la BD (igual que con las imágenes de producto)
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
    res.status(500).json({
      msg: 'Error al actualizar imagen de perfil',
      error: error.message
    });
  }
};


// ===================================================================
// ✏️ ACTUALIZAR PERFIL DEL USUARIO LOGUEADO (datos básicos)
// ===================================================================
export const updateProfile = async (req, res) => {
  const { nombre, telefono, direccion } = req.body;

  try {
    // Igual que antes, por si el token tiene id o id_usuario
    const userId = req.user.id || req.user.id_usuario;

    console.log('updateProfile -> req.user =', req.user);
    console.log('updateProfile -> userId =', userId);

    // User.update devuelve [númeroDeRegistrosActualizados]
    const [updated] = await User.update(
      { nombre, telefono, direccion },
      {
        where: { id_usuario: userId }
      }
    );

    // Si no se actualizó ningún registro, el usuario no existe
    if (!updated) {
      return res.status(404).json({ msg: 'Usuario no encontrado' });
    }

    res.json({ msg: 'Perfil actualizado correctamente' });

  } catch (error) {
    console.error('Error actualizando perfil:', error);
    res.status(500).json({ msg: 'Error actualizando perfil' });
  }
};
