// routes/index.js
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
  DownloadUser,
  SocioController,
  ContenedorController,
  LocalController,
  ProductoController,
  CategoriaController,
  OfertaController,
  UserController,
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
  // Las rutas de autenticación, como login y forgot-password, deben ser públicas.
  apiRouter.use('/auth', DownloadAuth);

  // Rutas GET ALL para datos públicos (mapa, listados generales)
  apiRouter.get('/contenedores/get-all', ContenedorController.getAllContenedores);
  apiRouter.get('/locales/get-all', LocalController.getAllLocales);
  apiRouter.get('/socios/get-all', SocioController.getAllSocios);
  apiRouter.get('/productos/get-all', ProductoController.getAllProductos);
  apiRouter.get('/categorias/get-all', CategoriaController.getAllCategorias);
  apiRouter.get('/ofertas/get-all', OfertaController.getAllOfertas);
  apiRouter.get('/locales/get-one/:id', LocalController.getOneLocal);
  apiRouter.get('/users/get-all', UserController.getAllUsers);
  apiRouter.get('/users/get-one/:id', UserController.getOneUser);

  // --- RUTAS PROTEGIDAS (REQUIEREN AUTENTICACIÓN) ---
  // Aplicamos el middleware de autenticación solo a las rutas que lo necesitan.
  apiRouter.use('/socios', AuthMiddleware, DownloadSocios);
  apiRouter.use('/contenedores', AuthMiddleware, DownloadContenedor);
  apiRouter.use('/locales', AuthMiddleware, DownloadLocales);
  apiRouter.use('/productos', AuthMiddleware, DownloadProductos);
  apiRouter.use('/categorias', AuthMiddleware, DownloadCategorias);
  apiRouter.use('/ofertas', AuthMiddleware, DownloadOfertas);
  apiRouter.use('/users', AuthMiddleware, DownloadUser);

  // NOTA IMPORTANTE:
  // La línea "apiRouter.use(AuthMiddleware);" DEBE ser eliminada.
  // La nueva sintaxis "apiRouter.use('/ruta', AuthMiddleware, router_de_ruta)"
  // ya aplica el middleware a todas las sub-rutas de manera más granular.

  router.use('/v1/api', apiRouter);

  router.get('/', (req, res) => {
    res.send('v.0.1.0.3');
  });

  return router;
};
