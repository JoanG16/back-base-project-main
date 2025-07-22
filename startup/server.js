// startup/server.js
const express = require('express');
const http = require('http');
const path = require('path');

let _express = null;
let _config = null;
let _server = null;

module.exports = class Server {
  constructor({ config, router }) {
    console.log('[Server CONSTRUCTOR DEBUG] Iniciando constructor de Server...');

    _config = config;

    _express = express();

    _express.use(require('cors')({
      origin: process.env.FRONTEND_URL || 'http://localhost:4200',
      methods: ['GET', 'POST', 'PUT', 'DELETE'],
      credentials: true
    }));
    _express.use(require('morgan')('dev'));
    _express.use(express.json({ limit: '50mb' }));
    _express.use(express.urlencoded({ limit: '50mb', extended: true }));

    // COMENTA O ELIMINA ESTAS LÍNEAS SI YA NO SIRVES IMÁGENES SUBIDAS LOCALMENTE
    // const PUBLIC_UPLOADS_DIR = path.join(process.cwd(), 'public', 'uploads');
    // console.log(`[Server DEBUG] Sirviendo archivos estáticos desde: ${PUBLIC_UPLOADS_DIR}`);
    // _express.use('/uploads', express.static(PUBLIC_UPLOADS_DIR)); // Monta la carpeta 'uploads' bajo la URL '/uploads'

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
