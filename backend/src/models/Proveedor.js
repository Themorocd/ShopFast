import { DataTypes } from 'sequelize';
import { sequelize } from '../config/db.js';

export const Proveedor = sequelize.define('Proveedor', {
  id_proveedor: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  id_categoria: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'categorias',
      key: 'id_categoria'
    }
  },
  nombre: {
    type: DataTypes.STRING(100),
    allowNull: false,
  },
  email: {
    type: DataTypes.STRING(100),
  },
  telefono: {
    type: DataTypes.STRING(50),
  },
}, {
  tableName: 'proveedores',
  timestamps: false,
}
);
