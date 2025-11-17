// src/models/DetallePedido.js
import { DataTypes } from 'sequelize';
import { sequelize } from '../config/db.js';
export const DetallePedido = sequelize.define('DetallePedido', {
  id_detalle: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  id_pedido: { type: DataTypes.INTEGER, allowNull: false },
  id_producto: { type: DataTypes.INTEGER, allowNull: false },
  cantidad: { type: DataTypes.INTEGER, allowNull: false },
  precio_unitario: { type: DataTypes.DECIMAL(10,2), allowNull: false }
}, { tableName: 'detalle_pedido', timestamps: false });
