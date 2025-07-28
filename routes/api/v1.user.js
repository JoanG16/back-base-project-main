// src/routes/api/v1.user.js
const { Router } = require('express');

module.exports = function ({ UserController }) {
  const router = Router();
  
  // GET all users
  router.get('/', UserController.getAllUsers);
  // GET one user by ID
  router.get('/:id', UserController.getOneUser);
  // CREATE a new user
  router.post('/', UserController.createUser);
  // UPDATE a user by ID
  router.put('/:id', UserController.updateUser);
  // DELETE a user by ID
  router.delete('/:id', UserController.deleteUser);

  return router;
};
