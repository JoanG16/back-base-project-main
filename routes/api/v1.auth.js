// src/routes/api/v1.auth.js
const { Router } = require('express');

module.exports = function ({ AuthController }) {
  const router = Router();

  router.post('/register', AuthController.register); // Ruta para registrar un usuario (solo para setup/pruebas)
  router.post('/login', AuthController.login);     // Ruta para iniciar sesión

  return router;
};
