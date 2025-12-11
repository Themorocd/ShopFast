// src/models/CarritoItem.js

import { DataTypes } from 'sequelize';
import { sequelize } from '../config/db.js';

// =======================================================================
// 🧺 MODELO CARRITO ITEM
// =======================================================================
// Este modelo representa cada UNA de las líneas dentro del carrito.
// Un carrito puede tener muchos CarritoItem, uno por cada producto añadido.
// Aquí es donde guardo:
//   - qué producto ha metido el usuario
//   - cuántas unidades
//   - el precio unitario del producto en ese momento
//
// Es muy parecido a una tabla de "detalles", pero para el carrito.
export const CarritoItem = sequelize.define(
  'CarritoItem',
  {
    // ID único del ítem del carrito
    id_item: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },

    // El carrito al que pertenece esta línea
    id_carrito: {
      type: DataTypes.INTEGER,
      allowNull: false
    },

    // El producto que se ha añadido al carrito
    id_producto: {
      type: DataTypes.INTEGER,
      allowNull: false
    },

    // Cantidad del producto que el usuario quiere
    cantidad: {
      type: DataTypes.INTEGER,
      allowNull: false
    },

    // Precio del producto en el momento de añadirlo.
    // Esto evita errores si el precio cambia más tarde.
    precio_unitario: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false
    }
  },

  {
    tableName: 'carrito_items',   // Nombre real de la tabla en MySQL
    timestamps: false             // No necesito createdAt / updatedAt
  }
);
