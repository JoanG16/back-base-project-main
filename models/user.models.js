// src/models/user.models.js
const { DataTypes } = require('sequelize');
const { postgresConnection } = require('../startup/database');
const bcrypt = require('bcryptjs');
const LocalModel = require('./locales.models'); // ¡CORREGIDO! 'models' en lugar de 'model'

const UserModel = postgresConnection.define('User', {
  id_user: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  username: {
    type: DataTypes.STRING(50),
    allowNull: false,
    unique: true,
  },
  password: {
    type: DataTypes.STRING(255),
    allowNull: false,
  },
  role: {
    type: DataTypes.STRING(50),
    allowNull: false,
    defaultValue: 'viewer',
  },
  id_local: {
    type: DataTypes.INTEGER,
    allowNull: true,
    references: {
      model: LocalModel,
      key: 'id_local',
    },
  },
  created_at: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
  },
}, {
  tableName: 'users',
  timestamps: false,
  hooks: {
    beforeCreate: async (user) => {
      if (user.password) {
        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(user.password, salt);
      }
    },
    beforeUpdate: async (user) => {
      if (user.changed('password')) {
        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(user.password, salt);
      }
    },
  },
});

UserModel.prototype.comparePassword = async function (candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

UserModel.belongsTo(LocalModel, { foreignKey: 'id_local', as: 'local' });

module.exports = UserModel;
