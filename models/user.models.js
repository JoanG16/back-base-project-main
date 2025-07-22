// src/models/user.models.js
const { DataTypes } = require('sequelize');
const { postgresConnection } = require('../startup/database');
const bcrypt = require('bcryptjs'); // Importar bcryptjs para hashing de contraseñas

const UserModel = postgresConnection.define('User', {
  id_user: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  username: {
    type: DataTypes.STRING(50),
    allowNull: false,
    unique: true, // El nombre de usuario debe ser único
  },
  password: {
    type: DataTypes.STRING(255), // Almacenará el hash de la contraseña
    allowNull: false,
  },
  role: {
    type: DataTypes.STRING(50), // Por ejemplo: 'admin', 'editor', 'viewer'
    allowNull: false,
    defaultValue: 'admin', // Por defecto, serán administradores
  },
  created_at: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
  },
}, {
  tableName: 'users', // Nombre de la tabla en la base de datos
  timestamps: false, // No usar campos createdAt/updatedAt automáticos de Sequelize
  hooks: {
    // Hook para hashear la contraseña antes de guardar un nuevo usuario o actualizarla
    beforeCreate: async (user) => {
      if (user.password) {
        const salt = await bcrypt.genSalt(10); // Generar un salt
        user.password = await bcrypt.hash(user.password, salt); // Hashear la contraseña
      }
    },
    beforeUpdate: async (user) => {
      if (user.changed('password')) { // Solo hashear si la contraseña ha cambiado
        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(user.password, salt);
      }
    },
  },
});

// Método de instancia para comparar contraseñas (no es un hook)
UserModel.prototype.comparePassword = async function (candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

module.exports = UserModel;
