// src/controllers/auth.controller.js
const catchControllerAsync = require('../utils/catch-controller-async');
const { appResponse } = require('../utils/app-response');

let _authService = null;

module.exports = class AuthController {
  constructor({ AuthService }) {
    _authService = AuthService;
  }

  /**
   * Endpoint para registrar un nuevo usuario.
   */
  register = catchControllerAsync(async (req, res) => {
    const { username, password, role } = req.body;
    const result = await _authService.registerUser({ username, password, role });
    return appResponse(res, { data: result.data, statusCode: 201, message: 'Usuario registrado exitosamente.' });
  });

  /**
   * Endpoint para iniciar sesión.
   */
  login = catchControllerAsync(async (req, res) => {
    const { username, password } = req.body;
    const result = await _authService.loginUser(username, password);
    return appResponse(res, { data: result.data, message: 'Inicio de sesión exitoso.' });
  });

  /**
   * NUEVO: Inicia el flujo de recuperación de contraseña.
   * Recibe el email del usuario y llama al servicio para procesarlo.
   */
  forgotPassword = catchControllerAsync(async (req, res) => {
    const { email } = req.body;
    await _authService.forgotPassword(email);
    return appResponse(res, { message: 'Si el email está registrado, se le enviará un enlace para restablecer su contraseña.' });
  });

  /**
   * NUEVO: Completa el restablecimiento de la contraseña.
   * Recibe el token de la URL y la nueva contraseña en el cuerpo de la solicitud.
   */
  resetPassword = catchControllerAsync(async (req, res) => {
    const { token } = req.params;
    const { newPassword } = req.body;
    await _authService.resetPassword(token, newPassword);
    return appResponse(res, { message: 'Su contraseña ha sido restablecida exitosamente.' });
  });
};
