// config/index.js
if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config();
}

module.exports = {
  PORT: process.env.PORT,
  DB_BACKBASE_URL: process.env.DB_BACKBASE_URL,
  EMAIL: process.env.EMAIL,
  PASSWORD: process.env.PASSWORD,
  APPLICATION_NAME: process.env.APPLICATION_NAME,
  JWT_SECRET: process.env.JWT_SECRET,
  CACHE_KEY: process.env.CACHE_KEY,
  // MODIFICACIÓN CLAVE: API_URL debe ser solo la URL base del backend sin puerto para producción.
  // En Render, setea la variable de entorno API_URL a la URL pública de tu backend (ej. https://your-backend.onrender.com)
  API_URL: process.env.API_URL,
  JWT_TOKEN_DURATION: process.env.JWT_TOKEN_DURATION,
  TIME_TO_EXPIRE: process.env.TIME_TO_EXPIRE,
  DB_SPORT_URL: process.env.DB_SPORT_URL,
  // NUEVO: Para la URL del frontend, usada en CORS
  FRONTEND_URL: process.env.FRONTEND_URL,



   CLOUDINARY_CLOUD_NAME: process.env.CLOUDINARY_CLOUD_NAME,
  CLOUDINARY_API_KEY: process.env.CLOUDINARY_API_KEY,
  CLOUDINARY_API_SECRET: process.env.CLOUDINARY_API_SECRET,
};
