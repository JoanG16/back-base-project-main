
// src/middlewares/auth.middleware.js
const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET || 'supersecretkey_dev';

module.exports = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({
      statusCode: 401,
      status: 'error',
      message: 'Acceso denegado. No se proporcionó token o formato inválido.',
    });
  }

  const token = authHeader.split(' ')[1];

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    console.error('Error al verificar el token:', error.message);
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({
        statusCode: 401,
        status: 'error',
        message: 'Token expirado. Por favor, inicie sesión de nuevo.',
      });
    }
    return res.status(401).json({
      statusCode: 401,
      status: 'error',
      message: 'Token inválido. Acceso denegado.',
    });
  }
};
