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
    type: DataTypes.STRING(255),
    allowNull: true,
  },
  instagram: {
    type: DataTypes.STRING(255),
    allowNull: true,
  },
  tiktok: {
    type: DataTypes.STRING(255),
    allowNull: true,
  },
  telefono: {
    type: DataTypes.STRING(20),
    allowNull: true,
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
    type: DataTypes.ARRAY(DataTypes.STRING),
    allowNull: true,
    defaultValue: [],
  },
  // NUEVO CAMPO: Descripción del local
  descripcion: {
    type: DataTypes.TEXT, // Usamos TEXT para descripciones más largas
    allowNull: true, // Puede ser nulo
  }
}, {
  tableName: 'locales',
  timestamps: false,
});

LocalModel.belongsTo(ContenedorModel, { foreignKey: 'id_contenedor', as: 'contenedor' });

module.exports = LocalModel;
