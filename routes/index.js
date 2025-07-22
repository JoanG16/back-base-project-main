const { Router } = require('express');
const AuthMiddleware = require('../middleware/auth.middleware'); // Importar el middleware de autenticación

module.exports = function ({
  DownloadSocios,
  DownloadContenedor,
  DownloadLocales,
  DownloadProductos,
  DownloadCategorias,
  DownloadOfertas,
  DownloadAuth,
  SocioController, // Necesitamos acceso directo a los controladores para rutas específicas
  ContenedorController,
  LocalController,
  ProductoController,
  CategoriaController,
  OfertaController
}) {
  const router = Router();
  const apiRouter = Router();

  // Middlewares globales para apiRouter
  apiRouter
    .use(require('cors')())
    .use(require('morgan')('dev'))
    .use(require('express').json())
    .use(require('express').urlencoded({ extended: true }));

  // --- RUTAS PÚBLICAS (NO REQUIEREN AUTENTICACIÓN) ---
  apiRouter.use('/auth', DownloadAuth); // Rutas de autenticación (login, register)

  // Rutas GET ALL para datos públicos (mapa, listados generales)
  apiRouter.get('/contenedores/get-all', ContenedorController.getAllContenedores);
  apiRouter.get('/locales/get-all', LocalController.getAllLocales);
  apiRouter.get('/socios/get-all', SocioController.getAllSocios);
  apiRouter.get('/productos/get-all', ProductoController.getAllProductos);
  apiRouter.get('/categorias/get-all', CategoriaController.getAllCategorias);
  apiRouter.get('/ofertas/get-all', OfertaController.getAllOfertas);
  apiRouter.get('/locales/get-one/:id', LocalController.getOneLocal);
  // Opcional: Si hay alguna ruta GET ONE que deba ser pública (ej. ver detalle de un local específico sin login)
  // apiRouter.get('/locales/get-one/:id', LocalController.getOneLocal);

  // --- APLICAR MIDDLEWARE DE AUTENTICACIÓN PARA LAS RUTAS PROTEGIDAS ---
  apiRouter.use(AuthMiddleware); // Todas las rutas definidas DESPUÉS de esta línea requerirán un JWT válido

  // --- RUTAS PROTEGIDAS (REQUIEREN AUTENTICACIÓN) ---
  // Ahora, las rutas de DownloadX se montarán y solo expondrán las operaciones que requieren autenticación.
  // Esto significa que DownloadX solo debe contener las rutas POST, PUT, DELETE y GET ONE (si no es pública).
  // Si tus DownloadX actuales tienen 'get-all', se ignorará porque ya lo definimos como público arriba.
  apiRouter.use('/socios', DownloadSocios);
  apiRouter.use('/contenedores', DownloadContenedor);
  apiRouter.use('/locales', DownloadLocales);
  apiRouter.use('/productos', DownloadProductos);
  apiRouter.use('/categorias', DownloadCategorias);
  apiRouter.use('/ofertas', DownloadOfertas);

  router.use('/v1/api', apiRouter);

  router.get('/', (req, res) => {
    res.send('v.0.1.0.3');
  });

  return router;
};
