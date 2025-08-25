// src/controllers/auth.controller.js

const httpStatus = require('http-status');
const catchAsync = require('../utils/catch-controller-async');

module.exports = class AuthController {
  constructor({ authService }) {
    this.authService = authService;
  }

  // Manejador de registro de usuario
  // Se ha convertido la propiedad de flecha en un método de clase
  async registerUser(req, res) {
    const { username, password, role } = req.body;
    const result = await this.authService.registerUser({ username, password, role });
    res.status(httpStatus.CREATED).json(result);
  }

  // Manejador de login de usuario
  async loginUser(req, res) {
    const { username, password } = req.body;
    const result = await this.authService.loginUser(username, password);
    res.status(httpStatus.OK).json(result);
  }

  // Manejador para solicitar el token de reseteo
  async forgotPassword(req, res) {
    const { email } = req.body;
    await this.authService.forgotPassword(email);
    res.status(httpStatus.OK).json({ message: 'Si el correo existe, se ha enviado un enlace para restablecer la contraseña.' });
  }

  // Manejador para el reseteo de la contraseña
  async resetPassword(req, res) {
    const { token } = req.params;
    const { newPassword } = req.body;

    await this.authService.resetPassword(token, newPassword);

    res.status(httpStatus.OK).json({ message: 'Contraseña restablecida correctamente.' });
  }
};
