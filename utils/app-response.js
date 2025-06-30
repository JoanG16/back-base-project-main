// backend/utils/app-response.js
const appResponse = (res, responseObject) => {
  let statusCode = 200;
  let status = 'Success';
  let message = 'Operación exitosa.';
  let data = null;

  // Si lo que recibimos es una instancia de Error (un error lanzado desde el servicio)
  if (responseObject instanceof Error) {
    statusCode = 500;
    status = 'Error';
    message = responseObject.message || 'Ocurrió un error inesperado en el servidor.';
  }
  // Si es un objeto de respuesta estructurado (ej. { statusCode, status, message, data })
  else if (typeof responseObject === 'object' && responseObject !== null) {
    if (responseObject.statusCode) statusCode = responseObject.statusCode;
    if (responseObject.status) status = responseObject.status;
    if (responseObject.message) message = responseObject.message;
    if (responseObject.data !== undefined) data = responseObject.data;

    // Si el estado es 'Error' y no hay mensaje específico, ponemos uno genérico de error
    if (status === 'Error' && !responseObject.message) {
      message = 'Ocurrió un error en la operación.';
    }
  }

  // Enviar la respuesta JSON
  return res.status(statusCode).json({
    statusCode,
    status,
    message,
    // Solo incluye 'data' si existe y si no es una respuesta de error (para evitar enviar 'data: null' en errores)
    ...(data !== null && status !== 'Error' ? { data } : {})
  });
};

module.exports = { appResponse };