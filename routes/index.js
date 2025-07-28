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
  DownloadUser, // <-- NUEVO: Importar la ruta de usuario
  SocioController, // Necesitamos acceso directo a los controladores para rutas específicas
  ContenedorController,
  LocalController,
  ProductoController,
  CategoriaController,
  OfertaController,
  UserController, // <-- NUEVO: Importar el controlador de usuario
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
  apiRouter.get('/users/get-all', UserController.getAllUsers); 
  apiRouter.get('/users/get-one/:id', UserController.getOneUser);

  // --- APLICAR MIDDLEWARE DE AUTENTICACIÓN PARA LAS RUTAS PROTEGIDAS ---
  apiRouter.use(AuthMiddleware); // Todas las rutas definidas DESPUÉS de esta línea requerirán un JWT válido

  // --- RUTAS PROTEGIDAS (REQUIEREN AUTENTICACIÓN) ---
  apiRouter.use('/socios', DownloadSocios);
  apiRouter.use('/contenedores', DownloadContenedor);
  apiRouter.use('/locales', DownloadLocales);
  apiRouter.use('/productos', DownloadProductos);
  apiRouter.use('/categorias', DownloadCategorias);
  apiRouter.use('/ofertas', DownloadOfertas);
  apiRouter.use('/users', DownloadUser); // <-- NUEVO: Montar las rutas protegidas del usuario

  router.use('/v1/api', apiRouter);

  router.get('/', (req, res) => {
    res.send('v.0.1.0.3');
  });

  return router;
};
