import { DataTypes } from 'sequelize';
import { sequelize } from '../config/db.js';

export const User = sequelize.define('User', {
  id_usuario: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  nombre: {
    type: DataTypes.STRING,
    allowNull: false
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false
  },
  rol: {
    type: DataTypes.ENUM('cliente', 'admin'),
    defaultValue: 'cliente'
  },
  verificado: {
  type: DataTypes.BOOLEAN,
  defaultValue: false
},
  telefono: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true
  },                        
  direccion: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true
  },
}, {
  tableName: 'usuarios',
  timestamps: false
});
