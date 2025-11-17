import { DataTypes } from 'sequelize';
import { sequelize } from '../config/db.js';

export const Pago = sequelize.define('Pago', {
  id_pago: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  id_pedido: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  metodo: {
    type: DataTypes.ENUM('paypal', 'mock'),
    allowNull: false
  },
  estado: {
    type: DataTypes.ENUM('creado', 'aprobado', 'fallido'),
    defaultValue: 'creado'
  },
  transaccion_id: {
    type: DataTypes.STRING,
    allowNull: true
  }
}, {
  tableName: 'pagos',
  timestamps: false
});
