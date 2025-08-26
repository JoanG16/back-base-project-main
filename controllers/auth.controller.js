// src/controllers/auth.controller.js
const AppError = require('../utils/app-error');
const catchAsync = require('../utils/catch-controller-async');

class AuthController {
  constructor({ authService }) {
    this.authService = authService;
  }

  registerUser = catchAsync(async (req, res, next) => {
    const { username, email, password, role } = req.body;
    try {
      const result = await this.authService.register({ username, email, password, role });
      res.status(201).json({
        status: 'success',
        message: 'Usuario registrado correctamente',
        data: result.data,
      });
    } catch (err) {
      // Envía el error con un formato consistente
      return next(new AppError(err.message, 400));
    }
  });

  loginUser = catchAsync(async (req, res, next) => {
    const { username, password } = req.body;
    try {
      const result = await this.authService.login(username, password);
      // La respuesta exitosa debe tener el formato que el frontend espera
      // { data: { token, user } }
      res.status(200).json({
        status: 'success',
        message: 'Login correcto',
        data: {
          token: result.token,
          user: result.user
        }
      });
    } catch (err) {
      // Envía el error con un formato consistente que incluye un mensaje
      return next(new AppError(err.message, 401));
    }
  });

  forgotPassword = catchAsync(async (req, res, next) => {
    const { email } = req.body;
    try {
      const result = await this.authService.forgotPassword(email);
      res.status(200).json({
        status: 'success',
        message: result.message,
      });
    } catch (err) {
      return next(new AppError(err.message, 400));
    }
  });

  resetPassword = catchAsync(async (req, res, next) => {
    const { token } = req.params;
    const { newPassword } = req.body;
    try {
      const result = await this.authService.resetPassword(token, newPassword);
      res.status(200).json({
        status: 'success',
        message: result.message,
      });
    } catch (err) {
      return next(new AppError(err.message, 400));
    }
  });
}

module.exports = AuthController;
