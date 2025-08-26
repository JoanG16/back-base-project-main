// src/controllers/auth.controller.js
const AppError = require('../utils/app-error');
const catchAsync = require('../utils/catch-controller-async');

class AuthController {
  constructor({ authService }) {
    this.authService = authService;
  }

  registerUser = catchAsync(async (req, res, next) => {
    const result = await this.authService.register(req.body);
    if (result?.error) {
      return next(new AppError(result.message, result.statusCode || 500));
    }
    res.status(201).json({
      status: 'success',
      message: result?.message || 'Usuario registrado correctamente',
      data: result?.data,
    });
  });

  
  loginUser = catchAsync(async (req, res, next) => {
    // ➡️ CAMBIO AQUÍ: extrae 'username' en lugar de 'email'
    const { username, password } = req.body;
    
    // ➡️ También debes cambiar la llamada al servicio para pasar 'username'
    //    Esto asume que ya has modificado el servicio para aceptar username
    const result = await this.authService.login(username, password); 
    if (result?.error) {
      return next(new AppError(result.message, result.statusCode || 401));
    }
    res.status(200).json({
      status: 'success',
      message: result?.message || 'Login correcto',
      token: result?.token,
      user: result?.user,
    });
  });

  forgotPassword = catchAsync(async (req, res, next) => {
    const { email } = req.body;
    const result = await this.authService.forgotPassword(email);
    if (result?.error) {
      return next(new AppError(result.message, result.statusCode || 500));
    }
    res.status(result?.statusCode || 200).json({
      status: 'success',
      message:
        result?.message || 'Si existe el correo, se envió un link de recuperación',
    });
  });

  resetPassword = catchAsync(async (req, res, next) => {
    const { token } = req.params;
    const { newPassword } = req.body;
    const result = await this.authService.resetPassword(token, newPassword);
    if (result?.error) {
      return next(new AppError(result.message, result.statusCode || 500));
    }
    res.status(result?.statusCode || 200).json({
      status: 'success',
      message: result?.message || 'Contraseña restablecida correctamente',
    });
  });
}

module.exports = AuthController;
