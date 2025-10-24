import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { sequelize } from './config/db.js';
import productoRoutes from './routes/productoRoutes.js';
import categoriaRoutes from './routes/categoriaRoutes.js';
import proveedorRoutes from './routes/proveedorRoutes.js';
import adminRoutes from './routes/adminRoutes.js';
import userRoutes from './routes/userRoutes.js'; 

dotenv.config();
const app = express();

app.use(cors());
app.use(express.json());

//Aquí se monta el prefijo de las rutas
app.use('/api/users', userRoutes);
app.use('/api/products', productoRoutes);
app.use('/api/categories', categoriaRoutes);
app.use('/api/providers', proveedorRoutes);
app.use('/api/admin', adminRoutes);


app.get('/', (req, res) => res.send('Servidor funcionando 🚀'));

const PORT = process.env.PORT || 3000;

sequelize.authenticate()
  .then(() => console.log('✅ Conectado a la base de datos MySQL'))
  .catch(err => console.error('❌ Error al conectar a MySQL:', err));

sequelize.sync().then(() => {
  app.listen(PORT, () => console.log(`Servidor corriendo en puerto ${PORT}`));
});
