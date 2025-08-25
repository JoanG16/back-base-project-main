// src/controllers/auth.controller.js

const httpStatus = require('http-status');
const catchAsync = require('../utils/catch-controller-async');

module.exports = class AuthController {
  constructor({ authService }) {
    this.authService = authService;
  }

  async registerUser(req, res) {
    const { username, password, role } = req.body;
    const result = await this.authService.registerUser({ username, password, role });
    res.status(httpStatus.CREATED).json(result);
  }

  async loginUser(req, res) {
    const { username, password } = req.body;
    const result = await this.authService.loginUser(username, password);
    res.status(httpStatus.OK).json(result);
  }

  async forgotPassword(req, res) {
    const { email } = req.body;
    try {
      // La llamada al servicio es correcta, solo necesita el email
      await this.authService.forgotPassword(email);
      // Mensaje genérico para no revelar si el correo existe
      res.status(httpStatus.OK).json({ message: 'Si el correo existe, se ha enviado un enlace para restablecer la contraseña.' });
    } catch (error) {
      // Si ocurre un error, el servicio podría haber lanzado una excepción
      console.error('Error en forgotPassword del controlador:', error.message);
      res.status(httpStatus.INTERNAL_SERVER_ERROR).json({ message: 'Ocurrió un error en el servidor. Intenta de nuevo más tarde.' });
    }
  }

  async resetPassword(req, res) {
    const { token } = req.params;
    const { newPassword } = req.body;

    try {
      // Llamada al servicio con el token y la nueva contraseña
      await this.authService.resetPassword(token, newPassword);
      res.status(httpStatus.OK).json({ message: 'Contraseña restablecida correctamente.' });
    } catch (error) {
      console.error('Error en resetPassword del controlador:', error.message);
      // Envía un error 400 (Bad Request) para indicar un token inválido o expirado
      res.status(httpStatus.BAD_REQUEST).json({ message: 'Error al actualizar la contraseña. El enlace pudo haber expirado.' });
    }
  }
};
