
// src/services/user.service.js
const BaseService = require('./base.service');
const catchServiceAsync = require('../utils/catch-service-async');
const crypto = require('crypto');

let _user = null;

module.exports = class UserService extends BaseService {
  constructor({ UserModel, LocalModel }) {
    super(UserModel);
    _user = UserModel;
    this.LocalModel = LocalModel;
  }

  getAllUsers = catchServiceAsync(async () => {
    const result = await _user.findAll({
      include: [{
        model: this.LocalModel,
        as: 'local',
        attributes: ['id_local', 'nombre_del_negocio']
      }]
    });
    return { data: result };
  });

  getOneUser = catchServiceAsync(async (id) => {
    const result = await _user.findByPk(id, {
      include: [{
        model: this.LocalModel,
        as: 'local',
        attributes: ['id_local', 'nombre_del_negocio']
      }]
    });
    if (!result) {
      throw new Error(`Usuario con ID ${id} no encontrado`);
    }
    return { data: result };
  });

  createUser = catchServiceAsync(async (body) => {
    if (!body.email) {
      throw new Error('El correo electrónico es requerido');
    }

    const existingUser = await _user.findOne({ where: { email: body.email } });
    if (existingUser) {
      throw new Error('Ya existe un usuario con este correo electrónico');
    }

    const result = await _user.create(body);
    return { data: result };
  });

  updateUser = catchServiceAsync(async (id, body) => {
    const user = await _user.findByPk(id);
    if (!user) {
      throw new Error(`Usuario con ID ${id} no encontrado`);
    }
    await user.update(body);
    return { data: user };
  });

  deleteUser = catchServiceAsync(async (id) => {
    const user = await _user.findByPk(id);
    if (!user) {
      throw new Error(`Usuario con ID ${id} no encontrado`);
    }
    await user.destroy();
    return { data: user };
  });

  findUserByUsernameOrEmail = catchServiceAsync(async (identifier) => {
    const user = await _user.findOne({
      where: {
        [require('sequelize').Op.or]: [
          { username: identifier },
          { email: identifier }
        ]
      }
    });
    return { data: user };
  });

  generateResetToken = catchServiceAsync(async (user) => {
    const token = crypto.randomBytes(32).toString('hex');
    const expires = new Date(Date.now() + 3600000);

    await user.update({
      reset_password_token: token,
      reset_password_expires: expires
    });

    return { data: token };
  });
};
