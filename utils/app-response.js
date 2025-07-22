// backend/utils/app-response.js
const appResponse = (res, responseObject) => {
  let statusCode = 200;
  let status = 'Success';
  let message = 'Operación exitosa.';
  let data = null;

  // Si lo que recibimos es una instancia de Error
  if (responseObject instanceof Error) {
    statusCode = 500;
    status = 'Error';
    message = responseObject.message || 'Ocurrió un error inesperado en el servidor.';
  } else if (typeof responseObject === 'object' && responseObject !== null) {
    if (responseObject.statusCode) statusCode = responseObject.statusCode;
    if (responseObject.status) status = responseObject.status;
    if (responseObject.message) message = responseObject.message;
    if (responseObject.data !== undefined) data = responseObject.data;

    if (status === 'Error' && !responseObject.message) {
      message = 'Ocurrió un error en la operación.';
    }
  }

  // 🔧 👉 AÑADE ESTA LÍNEA
  res.setHeader('Content-Type', 'application/json');

  // Enviar la respuesta JSON
  return res.status(statusCode).json({
    statusCode,
    status,
    message,
    ...(data !== null && status !== 'Error' ? { data } : {})
  });
};

module.exports = { appResponse };
