// backend/models/contenedor.models.js
const { DataTypes } = require('sequelize');
const { postgresConnection } = require('../startup/database');
const SocioModel = require('./socio.models'); // Asegúrate de importar SocioModel aquí

const ContenedorModel = postgresConnection.define('Contenedor', {
  id_contenedor: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  numero_contenedor: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  bloque: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  geom: {
    type: DataTypes.GEOMETRY('POLYGON', 4326), // Incluye SRID para exactitud
    allowNull: true,
  },
  socioId: { // <<<<<<<<<<<< ESTE CAMPO ES CRUCIAL
    type: DataTypes.INTEGER,
    allowNull: true, // O false, si un socio es obligatorio
    references: { // Configura la clave foránea
      model: SocioModel, // Hace referencia al modelo Socio
      key: 'id_socio',   // Columna en la tabla 'socios' a la que se referencia
    },
    onUpdate: 'CASCADE',
    onDelete: 'SET NULL', // O 'RESTRICT', 'CASCADE', etc., según tu lógica de negocio
  },
  creado_en: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
  },
}, {
  tableName: 'contenedores', // Nombre real de la tabla en PostgreSQL
  timestamps: false,
});

// Definir la relación (si no está ya definida globalmente)
ContenedorModel.belongsTo(SocioModel, { foreignKey: 'socioId', as: 'socio' });
// Si también quieres acceder a los contenedores desde el socio:
SocioModel.hasMany(ContenedorModel, { foreignKey: 'socioId', as: 'contenedores' });

module.exports = ContenedorModel;