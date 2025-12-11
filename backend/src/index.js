import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import multer from 'multer';
import { sequelize } from './config/db.js';
import productoRoutes from './routes/productoRoutes.js';
import categoriaRoutes from './routes/categoriaRoutes.js';
import proveedorRoutes from './routes/proveedorRoutes.js';
import adminRoutes from './routes/adminRoutes.js';
import userRoutes from './routes/userRoutes.js'; 
import orderRoutes from './routes/orderRoutes.js';
import paymentRoutes from './routes/paymentRoutes.js';


dotenv.config();
const app = express();

app.use(cors());
app.use(express.json());

// Necesario para tener __dirname con ESModules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// 👇 IMPORTANTÍSIMO: servir la carpeta backend/uploads
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

// Configuración de Multer
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadPath);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    const ext = path.extname(file.originalname);
    cb(null, uniqueSuffix + ext); // p.e. 1733709-123456789.jpg
  },
});

export const upload = multer({ storage });

//Aquí se monta el prefijo de las rutas
app.use('/api/users', userRoutes);
app.use('/api/products', productoRoutes);
app.use('/api/categories', categoriaRoutes);
app.use('/api/providers', proveedorRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/payments', paymentRoutes);
app.use('/api/users', userRoutes);


app.get('/', (req, res) => res.send('Servidor funcionando 🚀'));

const PORT = process.env.PORT || 3000;

sequelize.authenticate()
  .then(() => console.log('✅ Conectado a la base de datos MySQL'))
  .catch(err => console.error('❌ Error al conectar a MySQL:', err));

sequelize.sync().then(() => {
  app.listen(PORT, () => console.log(`Servidor corriendo en puerto ${PORT}`));
});
