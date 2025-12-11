// src/models/Carrito.js

import { DataTypes } from 'sequelize';
import { sequelize } from '../config/db.js';

// =======================================================================
// 🛒 MODELO CARRITO
// =======================================================================
// Este modelo representa el carrito de compra de cada usuario.
// La idea es que *cada usuario tenga un único carrito*, por eso id_usuario es único.
// El carrito almacena solo el dueño; los productos están en otra tabla: CarritoItem.
export const Carrito = sequelize.define(
  'Carrito',
  {
    // ID del carrito (clave primaria auto incremental)
    id_carrito: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },

    // Usuario al que pertenece el carrito.
    // UNIQUE → solo puede haber un carrito por usuario.
    id_usuario: {
      type: DataTypes.INTEGER,
      allowNull: false,
      unique: true   // Garantiza 1 carrito máximo por usuario
    }
  },

  {
    tableName: 'carritos',   // nombre de la tabla en la BD
    timestamps: false        // esta tabla no necesita createdAt / updatedAt
  }
);
// Nota: La relación entre Carrito y Usuario se define en models/associations.js