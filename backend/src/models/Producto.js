import { DataTypes } from 'sequelize';
import { sequelize } from '../config/db.js';
import { Categoria } from './Categoria.js';
import { Proveedor } from './Proveedor.js';

export const Producto = sequelize.define('Producto', {
  id_producto: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  nombre: {
    type: DataTypes.STRING(100),
    allowNull: false,
  },
  descripcion: {
    type: DataTypes.STRING(255),
  },
  precio: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
  },
  stock: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
  },
}, {
  tableName: 'productos',
  timestamps: false,
});

//Relaciones
Producto.belongsTo(Categoria, { foreignKey: 'id_categoria', as: 'categoria' });
Producto.belongsTo(Proveedor, { foreignKey: 'id_proveedor', as: 'proveedor' });
