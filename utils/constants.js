const VALIDATION_MESSAGES = {
  'string.base': '{#label} debe ser un texto',
  'string.empty': '{#label} no puede estar vacío',
  'string.min': '{#label} debe tener al menos {#limit} caracteres',
  'string.max': '{#label} no puede tener más de {#limit} caracteres',
  'string.email': '{#label} debe ser un correo válido',
  'number.base': '{#label} debe ser un número',
  'number.min': '{#label} debe ser mayor o igual a {#limit}',
  'number.max': '{#label} debe ser menor o igual a {#limit}',
  'any.required': '{#label} es un campo requerido',
  'object.unknown': 'No se permiten campos adicionales',
};

module.exports = { VALIDATION_MESSAGES };

module.exports = {
  VALIDATION_MESSAGES,
};
