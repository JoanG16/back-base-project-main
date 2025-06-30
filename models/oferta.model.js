const { DataTypes } = require('sequelize');
const { postgresConnection } = require('../startup/database');

const OfertaModel = postgresConnection.define('Oferta', {
  id_oferta: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  tipo_contenido: {
    type: DataTypes.STRING(50),
    allowNull: false,
  },
  valor_contenido: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
  orden: {
    type: DataTypes.INTEGER,
    allowNull: true, // El orden puede ser opcional
  },
  activo: {
    type: DataTypes.BOOLEAN,
    defaultValue: true, // Por defecto, una oferta está activa
  },
  creado_en: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW, // Fecha de creación automática
  },
  actualizado_en: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW, // Fecha de actualización automática
  },
}, {
  tableName: 'ofertas', // Nombre de la tabla en PostgreSQL
  timestamps: false, // Deshabilita los timestamps automáticos de Sequelize (createdAt, updatedAt)
                    // ya que estamos manejando creado_en y actualizado_en manualmente.
  hooks: {
    beforeUpdate: (oferta, options) => {
      oferta.actualizado_en = new Date(); // Actualiza la fecha manualmente en cada actualización
    },
  },
});

module.exports = OfertaModel;