
// src/controllers/auth.controller.js
const { appResponse } = require('../utils/app-response');

let _authService = null;

module.exports = class AuthController {
  constructor({ AuthService }) {
    _authService = AuthService;
  }

  register = async (req, res, next) => {
    try {
      const { username, password, role } = req.body;
      const result = await _authService.registerUser({ username, password, role });
      return appResponse(res, { data: result.data, statusCode: 201, message: 'Usuario registrado exitosamente.' });
    } catch (err) {
      next(err);
    }
  };

  login = async (req, res, next) => {
    try {
      const { username, password } = req.body;
      const result = await _authService.loginUser(username, password);
      return appResponse(res, { data: result.data, message: 'Inicio de sesión exitoso.' });
    } catch (err) {
      next(err);
    }
  };

  forgotPassword = async (req, res, next) => {
    try {
      const { email } = req.body;
      await _authService.forgotPassword(email);
      return appResponse(res, { message: 'Si el email está registrado, se le enviará un enlace para restablecer su contraseña.' });
    } catch (err) {
      next(err);
    }
  };

  resetPassword = async (req, res, next) => {
    try {
      const { token } = req.params;
      const { newPassword } = req.body;

      if (!newPassword || typeof newPassword !== 'string') {
        return res.status(400).json({ message: 'La nueva contraseña no es válida.' });
      }

      await _authService.resetPassword(token, newPassword);
      return appResponse(res, { message: 'Su contraseña ha sido restablecida exitosamente.' });
    } catch (err) {
      next(err);
    }
  };
};
