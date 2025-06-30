const AppError = require('../utils/app-error');
const { VALIDATION_MESSAGES } = require('../utils/constants');

const getCustomError = (error) => {
  const { type, context } = error;
  const message = VALIDATION_MESSAGES[type];

  if (!message) return { [context.key]: error.message };

  return {
    [context.key]: message.replace(/\{#(\w+)\}/g, (_, key) => context[key]),
  };
};

const validateRequest = (schemas) => {
  return async (req, res, next) => {
    try {
      const options = {
        abortEarly: false,
        stripUnknown: true,
      };

      if (schemas.body) {
        req.body = await schemas.body.validateAsync(req.body, options);
      }

      if (schemas.query) {
        req.query = await schemas.query.validateAsync(req.query, options);
      }

      if (schemas.params) {
        req.params = await schemas.params.validateAsync(req.params, options);
      }

      next();
    } catch (error) {
      const errorMessages = error.details.reduce((acc, detail) => {
        return { ...acc, ...getCustomError(detail) };
      }, {});

      next(new AppError(errorMessages, 400));
    }
  };
};

module.exports = validateRequest;
