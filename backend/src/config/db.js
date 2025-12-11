// Importo Sequelize, que es la librería que me permite conectarme y trabajar con MySQL de forma sencilla
import { Sequelize } from 'sequelize';

// Importo dotenv para poder usar las variables del archivo .env (usuario, contraseña, etc.)
import dotenv from 'dotenv';

// Cargo las variables del archivo .env en process.env
dotenv.config();

// Aquí creo la conexión a la base de datos usando Sequelize.
// En vez de poner los datos directamente, los saco del archivo .env para que sean más seguros.
export const sequelize = new Sequelize(
  process.env.DB_NAME,   // Nombre de la base de datos
  process.env.DB_USER,   // Usuario de MySQL
  process.env.DB_PASS,   // Contraseña del usuario
  {
    host: process.env.DB_HOST || 'localhost', // Dirección del servidor MySQL (si no existe usa localhost)
    dialect: 'mysql',     // Indico que voy a usar MySQL como motor de base de datos
    logging: false,        // Desactivo los mensajes que Sequelize imprime en consola para que no molesten
  }
);

// Este bloque simplemente intenta conectarse a MySQL para comprobar que los datos son correctos
(async () => {
  try {
    // authenticate() intenta establecer la conexión con la base de datos
    await sequelize.authenticate();
    console.log('✅ Conectado correctamente a MySQL con Sequelize');
  } catch (error) {
    // Si algo falla (datos incorrectos, MySQL apagado, etc.) lo capturo aquí
    console.error('❌ Error al conectar con la base de datos:', error);
  }
})();
