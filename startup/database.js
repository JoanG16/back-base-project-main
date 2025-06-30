const { Sequelize } = require('sequelize');

const postgresConnection = new Sequelize(
  process.env.DB_NAME || 'Contenedores',
  process.env.DB_USER || 'postgres',
  process.env.DB_PASSWORD || '1234567890',
  {
    host: process.env.DB_HOST || 'localhost',
    port: process.env.DB_PORT || 5432,
    dialect: 'postgres',
    logging: false,
  }
);

postgresConnection.authenticate()
  .then(() => console.log('✅ Conectado a PostgreSQL con Sequelize'))
  .catch((err) => console.error('❌ Error al conectar con Sequelize:', err));

module.exports = { postgresConnection };
