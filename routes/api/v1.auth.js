/* const { Router } = require('express');
const { UserValidator } = require('../../utils/validators');

module.exports = function ({ AuthController, JoiValidatorMiddleware }) {
  const router = Router();

  router.post(
    '/register',
    JoiValidatorMiddleware(UserValidator.register),
    AuthController.register
  );

  router.post(
    '/login',
    JoiValidatorMiddleware(UserValidator.login),
    AuthController.login
  );

  router.post('/logout', AuthController.logout);

  return router;
};
 */