// index.js (RAÍZ DEL BACKEND)
// No es necesario importar 'express' directamente aquí si 'Server' lo gestiona
const container = require('./config/container'); // Importa el contenedor de dependencias

// Resuelve la instancia de Server del contenedor Awilix
// La clase Server (definida en startup/server.js) será instanciada por Awilix
// y recibirá 'config' y 'router' como dependencias.
const server = container.resolve('Server');

// Inicia el servidor.
// Esto llamará al método 'start()' de la instancia de Server,
// que a su vez inicializará Express, aplicará los middlewares
// y pondrá el servidor HTTP a escuchar en el puerto.
server.start();

// Las siguientes líneas han sido ELIMINADAS/COMENTADAS porque su funcionalidad
// ahora es manejada de forma centralizada y correcta dentro de la clase Server
// en startup/server.js. Incluirlas aquí crearía redundancia y conflictos.

// const app = express();
// const router = container.resolve('router');
// app.use(express.json());
// app.use(router);
// const cors = require('cors');
// app.use(cors({ /* ... */ }));
// app._router.stack.forEach((middleware) => { /* ... */ });
// const PORT = process.env.PORT || 3000;
// app.listen(PORT, () => { /* ... */ });
