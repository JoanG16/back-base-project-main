// src/services/auth.service.js
const jwt = require('jsonwebtoken');
const catchServiceAsync = require('../utils/catch-service-async');

const JWT_SECRET = process.env.JWT_SECRET || 'supersecretkey_dev';
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '1h';

let _userModel = null; // Variable interna para almacenar el modelo de usuario

module.exports = class AuthService {
  // ¡IMPORTANTE! Asegúrate de que el parámetro sea { UserModel }
  constructor({ UserModel }) {
    _userModel = UserModel;
  }

  /**
   * Registra un nuevo usuario (opcional, solo para configurar administradores iniciales).
   */
  registerUser = catchServiceAsync(async (userData) => {
    const { username, password, role } = userData;

    const existingUser = await _userModel.findOne({ where: { username } });
    if (existingUser) {
      throw new Error('El nombre de usuario ya existe.');
    }

    const newUser = await _userModel.create({ username, password, role });
    return { data: { id_user: newUser.id_user, username: newUser.username, role: newUser.role } };
  });

  /**
   * Autentica a un usuario y genera un JWT.
   */
  loginUser = catchServiceAsync(async (username, password) => {
    // 1. Buscar el usuario por nombre de usuario
    const user = await _userModel.findOne({ where: { username } });
    if (!user) {
      throw new Error('Credenciales inválidas: Usuario no encontrado.');
    }

    // 2. Comparar la contraseña proporcionada con la contraseña hasheada en la BD
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      throw new Error('Credenciales inválidas: Contraseña incorrecta.');
    }

    // 3. Si las credenciales son válidas, generar un JWT
    const token = jwt.sign(
      { id: user.id_user, username: user.username, role: user.role },
      JWT_SECRET,
      { expiresIn: JWT_EXPIRES_IN }
    );

    return {
      data: {
        token,
        user: {
          id_user: user.id_user,
          username: user.username,
          role: user.role,
        },
      },
    };
  });
};
