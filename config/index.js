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
  API_URL: `${process.env.API_URL}:${process.env.PORT}`,
  JWT_TOKEN_DURATION: process.env.JWT_TOKEN_DURATION,
  CACHE_KEY: process.env.CACHE_KEY,
  TIME_TO_EXPIRE: process.env.TIME_TO_EXPIRE,
  DB_SPORT_URL: process.env.DB_SPORT_URL,
  // SWAGGER_PATH: __dirname.concat("/swagger/swaggerDEV.json"),
};
