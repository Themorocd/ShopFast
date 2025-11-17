// src/models/CarritoItem.js
import { DataTypes } from 'sequelize';
import { sequelize } from '../config/db.js';
export const CarritoItem = sequelize.define('CarritoItem', {
  id_item: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  id_carrito: { type: DataTypes.INTEGER, allowNull: false },
  id_producto: { type: DataTypes.INTEGER, allowNull: false },
  cantidad: { type: DataTypes.INTEGER, allowNull: false },
  precio_unitario: { type: DataTypes.DECIMAL(10,2), allowNull: false }
}, { tableName: 'carrito_items', timestamps: false });
