import { DataTypes } from 'sequelize';
import { sequelize } from '../config/db.js';

export const Categoria = sequelize.define('Categoria', {
  id_categoria: {
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
}, {
  tableName: 'categorias',
  timestamps: false,
});
