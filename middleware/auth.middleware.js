// src/middlewares/auth.middleware.js
const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET || 'supersecretkey_dev'; // Debe coincidir con la clave del servicio

module.exports = (req, res, next) => {
  // 1. Obtener el token del encabezado de autorización
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({
      statusCode: 401,
      status: 'error',
      message: 'Acceso denegado. No se proporcionó token o formato inválido.',
    });
  }

  const token = authHeader.split(' ')[1]; // Obtener el token después de 'Bearer '

  try {
    // 2. Verificar el token
    const decoded = jwt.verify(token, JWT_SECRET);

    // 3. Adjuntar la información del usuario decodificada al objeto de solicitud
    // Esto permite que los controladores accedan a req.user (ej. req.user.id, req.user.role)
    req.user = decoded;
    next(); // Continuar con la siguiente función de middleware o controlador
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
