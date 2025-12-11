import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
dotenv.config();


// =======================================================================
// 🔒 verifyToken → Middleware de autenticación con JWT
// =======================================================================
// Este middleware se ejecuta ANTES de entrar en cualquier ruta protegida.
// Su función es:
//   1. Comprobar que el cliente envía un token válido en el header Authorization
//   2. Verificar ese token con la clave secreta de JWT
//   3. Si es válido → permitir el acceso y guardar los datos del usuario en req.user
//   4. Si no es válido → bloquear el acceso
export const verifyToken = (req, res, next) => {

  // El token viene en el header:
  // Authorization: Bearer <token>
  const authHeader = req.headers['authorization'];

  // authHeader puede venir undefined → por eso lo valido así
  const token = authHeader && authHeader.split(' ')[1];

  // Si no hay token → deniego acceso
  if (!token) {
    return res.status(401).json({ msg: 'Acceso denegado, token no proporcionado' });
  }

  try {
    // Verifico el token con la clave secreta guardada en .env
    const verified = jwt.verify(token, process.env.JWT_SECRET);

    // Si el token es válido, guardo su contenido en req.user
    // Por ejemplo: { id: 12, rol: 'cliente', iat:..., exp:... }
    req.user = verified;

    // Paso al siguiente middleware o al controlador final
    next();

  } catch (err) {
    // Si el token está mal firmado, expirado o manipulado → error
    res.status(403).json({ msg: 'Token inválido o expirado' });
  }
};
