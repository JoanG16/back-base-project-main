module.exports = {
  ErrorMiddleware: require('./error.middleware'),
  AuthMiddleware: require('./auth.middleware'),
  JoiValidatorMiddleware: require('./joi-validator.middleware'),
  NotFoundMiddleware: require('./not-found.middleware'),
};
