const Joi = require('joi');

const loginSchema = Joi.object({
  username: Joi.string().required().label('Usuario'),
  password: Joi.string().required().label('Contraseña'),
});

const registerSchema = Joi.object({
  username: Joi.string().min(3).max(30).required().label('Usuario'),
  password: Joi.string().min(6).required().label('Contraseña'),
});

module.exports = {
  login: { body: loginSchema },
  register: { body: registerSchema },
};
