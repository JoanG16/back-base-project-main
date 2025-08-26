// src/models/locales.model.js
const { DataTypes } = require('sequelize');
const { postgresConnection } = require('../startup/database');
const ContenedorModel = require('./contenedor.models');

const LocalModel = postgresConnection.define('Local', {
  id_local: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  nombre_del_negocio: {
    type: DataTypes.STRING(150),
    allowNull: false,
  },
  nombre_del_dueno: {
    type: DataTypes.STRING(150),
    allowNull: false,
  },
  codigo_local: {
    type: DataTypes.STRING(50),
    unique: true,
    allowNull: false,
  },
  facebook: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  instagram: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  tiktok: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  telefono: {
    type: DataTypes.STRING(20),
    allowNull: true,
  },
  ruc: {
    type: DataTypes.STRING(13),
    allowNull: false,
    unique: true,
  },
  correo: {
    type: DataTypes.STRING(255),
    allowNull: false,
    unique: true,
  },
  id_contenedor: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: ContenedorModel,
      key: 'id_contenedor',
    }
  },
  creado_en: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
  },
  imagen_urls: {
    type: DataTypes.ARRAY(DataTypes.TEXT),
    allowNull: true,
    defaultValue: [],
  },
  descripcion: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  // --- NUEVO CAMPO: Para manejar la activación/desactivación ---
  activo: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: true, // Por defecto, un local se crea como activo
  },
}, {
  tableName: 'locales',
  timestamps: false,
});

LocalModel.belongsTo(ContenedorModel, { foreignKey: 'id_contenedor', as: 'contenedor' });

module.exports = LocalModel;