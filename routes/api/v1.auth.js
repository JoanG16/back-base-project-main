// src/routes/api/v1.auth.js

const { Router } = require('express');

module.exports = function ({ AuthController }) {
  const router = Router();

  // Ruta para registrar un usuario
  router.post('/register', (req, res, next) => AuthController.registerUser(req, res, next));

  // Ruta para iniciar sesión
  router.post('/login', (req, res, next) => AuthController.loginUser(req, res, next));

  // Inicia el proceso de recuperación de contraseña
  router.post('/forgot-password', (req, res, next) => AuthController.forgotPassword(req, res, next));

  // Restablece la contraseña usando el token
  router.post('/reset-password/:token', (req, res, next) => AuthController.resetPassword(req, res, next));

  return router;
};
