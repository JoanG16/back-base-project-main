const { DataTypes } = require('sequelize');
const { postgresConnection } = require('../startup/database');
const LocalModel = require('./locales.models');
const ProductoModel = require('./productos.models');

const LocalProductoModel = postgresConnection.define('LocalProducto', {
    id_local: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        references: {
            model: LocalModel,
            key: 'id_local',
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
    },
    id_producto: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        references: {
            model: ProductoModel,
            key: 'id_producto',
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
    },
}, {
    tableName: 'locales_productos', // Asegúrate de que coincida con el nombre de tu tabla pivote
    timestamps: false,
});

// Definir las asociaciones de muchos a muchos
LocalModel.belongsToMany(ProductoModel, { through: LocalProductoModel, foreignKey: 'id_local', as: 'productos' });
ProductoModel.belongsToMany(LocalModel, { through: LocalProductoModel, foreignKey: 'id_producto', as: 'locales' });

module.exports = LocalProductoModel;