// src/services/user.service.js
const catchServiceAsync = require('../utils/catch-service-async');
const BaseService = require('./base.service');

let _user = null;

module.exports = class UserService extends BaseService {
  constructor({ UserModel, LocalModel }) {
    super(UserModel);
    _user = UserModel;
    this.LocalModel = LocalModel; // Guardar el modelo de local para la relación
  }

  /**
   * Obtiene todos los usuarios, incluyendo su local.
   */
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

  /**
   * Obtiene un usuario por su ID, incluyendo su local.
   */
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

  /**
   * Crea un nuevo usuario.
   */
  createUser = catchServiceAsync(async (body) => {
    const result = await _user.create(body);
    return { data: result };
  });

  /**
   * Actualiza un usuario existente.
   */
  updateUser = catchServiceAsync(async (id, body) => {
    const user = await _user.findByPk(id);
    if (!user) {
      throw new Error(`Usuario con ID ${id} no encontrado`);
    }
    await user.update(body);
    return { data: user };
  });

  /**
   * Elimina un usuario por su ID.
   */
  deleteUser = catchServiceAsync(async (id) => {
    const user = await _user.findByPk(id);
    if (!user) {
      throw new Error(`Usuario con ID ${id} no encontrado`);
    }
    await user.destroy();
    return { data: user };
  });
};
