// src/controllers/auth.controller.js
const catchControllerAsync = require('../utils/catch-controller-async'); // Asegúrate de tener este util
const { appResponse } = require('../utils/app-response'); // Asegúrate de tener este util

let _authService = null;

module.exports = class AuthController {
  constructor({ AuthService }) {
    _authService = AuthService;
  }

  /**
   * Endpoint para registrar un nuevo usuario.
   * Solo para fines de prueba o setup inicial. En producción, esto debería ser más controlado.
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
    // El servicio ya devuelve el token y el usuario en 'data'
    return appResponse(res, { data: result.data, message: 'Inicio de sesión exitoso.' });
  });
};
