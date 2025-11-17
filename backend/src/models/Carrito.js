// src/models/Carrito.js
import { DataTypes } from 'sequelize';
import { sequelize } from '../config/db.js';
export const Carrito = sequelize.define('Carrito', {
  id_carrito: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  id_usuario: { type: DataTypes.INTEGER, allowNull: false, unique: true }
}, { tableName: 'carritos', timestamps: false });
