const { DataTypes } = require('sequelize');
const { postgresConnection } = require('../startup/database');
const CategoriaModel = require('./categorias.models'); // Asegúrate de tener este modelo
const LocalModel = require('./locales.models'); // Asegúrate de tener este modelo

const ProductoModel = postgresConnection.define('Producto', {
  id_producto: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  nombre: {
    type: DataTypes.STRING,
    allowNull: false,
  },

  descripcion_adicional: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  // REMOVIDO: id_local ya no va aquí para la relación de muchos a muchos
  id_categoria: {
    type: DataTypes.INTEGER,
    allowNull: true, // O false si la categoría es obligatoria
    references: {
      model: CategoriaModel,
      key: 'id_categoria',
    }
  },
  creado_en: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
  },
}, {
  tableName: 'productos',
  timestamps: false,
});

// Definir asociaciones
ProductoModel.belongsTo(CategoriaModel, { foreignKey: 'id_categoria', as: 'categoria' });

module.exports = ProductoModel;