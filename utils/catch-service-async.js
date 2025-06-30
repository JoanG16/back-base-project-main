// backend/utils/catch-service-async.js
module.exports = (serviceFunc) => async (...args) => {
  try {
    return await serviceFunc(...args);
  } catch (error) {
    console.error('Service Error:', error.message, error.stack); // Más detalle del error
    throw error; // Re-lanza el error para que sea capturado por el controlador y appResponse
  }
};