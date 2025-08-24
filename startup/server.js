// startup/server.js
const express = require('express');
const http = require('http');
const path = require('path');

let _express = null;
let _config = null;
let _server = null;

// Directorio donde se construyeron los archivos de Angular
const frontendPath = path.join(__dirname, '..', '..', 'dist');

module.exports = class Server {
  constructor({ config, router }) {
    console.log('[Server CONSTRUCTOR DEBUG] Iniciando constructor de Server...');
    _config = config;
    _express = express();

    // Configuración de CORS
    _express.use(require('cors')({
      origin: process.env.FRONTEND_URL || 'http://localhost:4200',
      methods: ['GET', 'POST', 'PUT', 'DELETE'],
      credentials: true
    }));
    _express.use(require('morgan')('dev'));
    _express.use(express.json({ limit: '50mb' }));
    _express.use(express.urlencoded({ limit: '50mb', extended: true }));

    // Sirviendo los archivos estáticos de la aplicación Angular
    _express.use(express.static(frontendPath));

    // Ruta comodín para que Angular Router maneje todas las rutas del frontend
    _express.get('*', (req, res) => {
      res.sendFile(path.join(frontendPath, 'index.html'));
    });

    // Rutas de la API (DEBEN IR DESPUÉS DE LAS RUTAS ESTÁTICAS)
    _express.use(router);

    _server = http.createServer(_express);
  }

  start() {
    return new Promise((resolve, reject) => {
      _server.listen(_config.PORT, async () => {
        console.log(
          `${_config.APPLICATION_NAME} on port ${_config.PORT} API_URL: ${process.env.API_URL} FRONTEND_URL: ${process.env.FRONTEND_URL}`
        );
        resolve();
      }).on('error', (err) => {
        console.error('Error al iniciar el servidor HTTP:', err);
        reject(err);
      });
    });
  }
};
