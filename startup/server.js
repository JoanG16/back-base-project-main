// startup/server.js
const express = require('express');
const http = require('http');
const path = require('path');

let _express = null;
let _config = null;
let _server = null; // Declarada a nivel de módulo para ser accesible por start()

module.exports = class Server {
  constructor({ config, router }) {
    console.log('[Server CONSTRUCTOR DEBUG] Iniciando constructor de Server...');

    _config = config; // Asigna el config pasado por Awilix
    _express = express(); // Inicializa la instancia de Express

    // Middlewares globales aplicados a la instancia de Express
    _express.use(require('cors')({
      origin: 'http://localhost:4200', // Tu frontend
      methods: ['GET', 'POST', 'PUT', 'DELETE'],
      credentials: true
    }));
    _express.use(require('morgan')('dev')); // Logger de peticiones
    _express.use(express.json({ limit: '50mb' })); // Body-parser para JSON con límite alto
    _express.use(express.urlencoded({ limit: '50mb', extended: true })); // Body-parser para URL-encoded con límite alto

    // Configuración para servir archivos estáticos (imágenes)
    // Usa process.cwd() para asegurar que la ruta se resuelve desde la raíz del proyecto
    const PUBLIC_UPLOADS_DIR = path.join(process.cwd(), 'public', 'uploads');
    console.log(`[Server DEBUG] Sirviendo archivos estáticos desde: ${PUBLIC_UPLOADS_DIR}`);
    _express.use('/uploads', express.static(PUBLIC_UPLOADS_DIR)); // Monta la carpeta 'uploads' bajo la URL '/uploads'

    _express.use(router); // Monta todas las rutas de tu API

    // ¡¡¡CAMBIO CLAVE!!! Inicializa _server aquí, después de que _express esté completamente configurado
    _server = http.createServer(_express);
  }

  start() {
    return new Promise((resolve, reject) => {
      // Intenta escuchar en el puerto configurado
      _server.listen(_config.PORT, async () => {
        console.log(
          `${_config.APPLICATION_NAME} on port ${_config.PORT} ${_config.API_URL} `
        );
        resolve(); // Resuelve la promesa una vez que el servidor está escuchando
      }).on('error', (err) => { // Captura errores si el servidor no puede iniciar
        console.error('Error al iniciar el servidor HTTP:', err);
        reject(err); // Rechaza la promesa con el error
      });
    });
  }
};
