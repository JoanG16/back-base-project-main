// src/routes/api/v1.auth.js

const { Router } = require('express');
const catchAsync = require('../../utils/catch-controller-async'); // Asegurarse de que catchAsync esté disponible

module.exports = function ({ AuthController }) {
  const router = Router();

  // Ruta para registrar un usuario
  router.post('/register', catchAsync(AuthController.registerUser.bind(AuthController)));

  // Ruta para iniciar sesión
  router.post('/login', catchAsync(AuthController.loginUser.bind(AuthController)));

  // Inicia el proceso de recuperación de contraseña
  router.post('/forgot-password', catchAsync(AuthController.forgotPassword.bind(AuthController)));

  // Restablece la contraseña usando el token
  router.post('/reset-password/:token', catchAsync(AuthController.resetPassword.bind(AuthController)));

  return router;
};
