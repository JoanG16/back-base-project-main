// src/routes/api/v1.auth.js

const { Router } = require('express');

// La función `module.exports` recibe un objeto con la instancia del controlador.
module.exports = function ({ AuthController }) {
  const router = Router();

  // Ruta para registrar un usuario
  // Ahora usamos la instancia del controlador para llamar al método.
  router.post('/register', AuthController.registerUser);

  // Ruta para iniciar sesión
  router.post('/login', AuthController.loginUser);

  // NUEVA RUTA: Inicia el proceso de recuperación de contraseña
  router.post('/forgot-password', AuthController.forgotPassword);

  // NUEVA RUTA: Restablece la contraseña usando el token
  router.post('/reset-password/:token', AuthController.resetPassword);

  return router;
};
