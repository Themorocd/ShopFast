import { DataTypes } from 'sequelize';
import { sequelize } from '../config/db.js';

// =======================================================================
// 🏷️ MODELO CATEGORÍA
// =======================================================================
// Este modelo representa las categorías de productos dentro de ShopFast.
// Una categoría ayuda a organizar los productos (ropa, calzado, accesorios, etc.).
// Los productos luego tienen un campo id_categoria que hace referencia a esta tabla.
//
export const Categoria = sequelize.define(
  'Categoria',
  {
    // ID único de la categoría
    id_categoria: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },

    // Nombre de la categoría (obligatorio)
    // Ejemplos: "Hombre", "Mujer", "Zapatillas", "Accesorios", etc.
    nombre: {
      type: DataTypes.STRING(100),
      allowNull: false
    },

    // Descripción opcional para dar más contexto
    descripcion: {
      type: DataTypes.STRING(255)
    }
  },

  {
    tableName: 'categorias', // Nombre real de la tabla en la base de datos
    timestamps: false        // No necesito createdAt / updatedAt
  }
);
// Nota: Las relaciones entre Categoria y Producto
// se definen en models/associations.js