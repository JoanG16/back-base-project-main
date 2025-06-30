const { DataTypes } = require('sequelize');
const { postgresConnection } = require('../startup/database');

const CategoriaModel = postgresConnection.define('Categoria', {
  id_categoria: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  nombre_categoria: {
    type: DataTypes.STRING(100),
    allowNull: false,
    unique: true,
  },
}, {
  tableName: 'categorias',
  timestamps: false,
});

module.exports = CategoriaModel;
