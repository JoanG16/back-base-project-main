// src/controllers/auth.controller.js

const httpStatus = require('http-status');
const catchAsync = require('../utils/catch-controller-async');
const authService = require('../services/auth.service');

const authController = {
  // Manejador de registro de usuario
  registerUser: catchAsync(async (req, res) => {
    const { username, password, role } = req.body;
    const result = await authService.registerUser({ username, password, role });
    res.status(httpStatus.CREATED).json(result);
  }),

  // Manejador de login de usuario
  loginUser: catchAsync(async (req, res) => {
    const { username, password } = req.body;
    const result = await authService.loginUser(username, password);
    res.status(httpStatus.OK).json(result);
  }),

  // Manejador para solicitar el token de reseteo
  forgotPassword: catchAsync(async (req, res) => {
    const { email } = req.body;
    await authService.forgotPassword(email);
    res.status(httpStatus.OK).json({ message: 'Si el correo existe, se ha enviado un enlace para restablecer la contraseña.' });
  }),

  // Manejador para el reseteo de la contraseña
  // CORREGIDO: Se extrae el token de los parámetros y la nueva contraseña del cuerpo.
  resetPassword: catchAsync(async (req, res) => {
    // Extraer el token de los parámetros de la URL
    const { token } = req.params;
    // Extraer la nueva contraseña del cuerpo de la solicitud
    const { newPassword } = req.body;

    // Llamar al servicio con ambos valores
    await authService.resetPassword({ token, newPassword });

    res.status(httpStatus.OK).json({ message: 'Contraseña restablecida correctamente.' });
  }),
};

module.exports = authController;
