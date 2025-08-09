// src/services/user.service.js
const catchServiceAsync = require('../utils/catch-service-async');
const BaseService = require('./base.service');
const crypto = require('crypto'); // Para generar el token de recuperación

let _user = null;

module.exports = class UserService extends BaseService {
  constructor({ UserModel, LocalModel }) {
    super(UserModel);
    _user = UserModel;
    this.LocalModel = LocalModel;
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
   * Crea un nuevo usuario. Ahora también requiere el campo 'email'.
   */
  createUser = catchServiceAsync(async (body) => {
    // Validar que el email no esté vacío y sea único
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

  /**
   * NUEVO: Busca un usuario por su nombre de usuario o correo electrónico.
   * Este método es crucial para el flujo de recuperación de contraseña.
   */
  findUserByUsernameOrEmail = catchServiceAsync(async (identifier) => {
    const user = await _user.findOne({
      where: {
        // Busca por username o email
        [require('sequelize').Op.or]: [
          { username: identifier },
          { email: identifier }
        ]
      }
    });
    return { data: user };
  });

  /**
   * NUEVO: Genera y guarda un token de recuperación para el usuario.
   */
  generateResetToken = catchServiceAsync(async (user) => {
    const token = crypto.randomBytes(32).toString('hex');
    const expires = new Date(Date.now() + 3600000); // Token válido por 1 hora

    await user.update({
      reset_password_token: token,
      reset_password_expires: expires
    });

    return { data: token };
  });
};
