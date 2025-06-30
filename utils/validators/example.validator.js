const Joi = require('joi');

// Schemas para body
const createExampleSchema = Joi.object({
  title: Joi.string().min(3).max(10).required().label('Título'),
  description: Joi.string().max(50).required().label('Descripción'),
  color: Joi.string().max(10).required().label('Color'),
});

// Schema para params
const paramsSchema = Joi.object({
  id: Joi.string().required(),
});

// Schema para query
const querySchema = Joi.object({
  page: Joi.number().min(1),
  limit: Joi.number().min(1).max(100),
  sort: Joi.string(),
});

module.exports = {
  create: { body: createExampleSchema },
  getById: { params: paramsSchema },
  getAll: { query: querySchema },
};
