const { Router } = require('express');

module.exports = function ({ AuthController }) {
  const router = Router();

  // Ruta para registrar un usuario
  router.post('/register', AuthController.register);

  // Ruta para iniciar sesión
  router.post('/login', AuthController.login);

  // NUEVA RUTA: Inicia el proceso de recuperación de contraseña
  // Recibe el correo electrónico del usuario.
  router.post('/forgot-password', AuthController.forgotPassword);

  // NUEVA RUTA: Restablece la contraseña usando el token
  // Recibe el token de la URL y la nueva contraseña en el cuerpo.
  router.post('/reset-password/:token', AuthController.resetPassword);

  return router;
};
