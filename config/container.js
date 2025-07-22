// config/container.js
const { createContainer, asClass, asFunction, asValue } = require('awilix');

const Routes = require('../routes');
const Server = require('../startup/server');

// Modelos
const SocioModel = require('../models/socio.models');
const ContenedorModel = require('../models/contenedor.models');
const LocalModel = require('../models/locales.models');
const ProductoModel = require('../models/productos.models');
const CategoriaModel = require('../models/categorias.models');
const OfertaModel = require('../models/oferta.model');
const UserModel = require('../models/user.models');

// Servicios
const SocioService = require('../services/socio.service');
const ContenedorService = require('../services/contenedor.service');
const LocalService = require('../services/locales.service');
const ProductoService = require('../services/productos.service');
const CategoriaService = require('../services/categorias.service');
const OfertaService = require('../services/oferta.service');
const AuthService = require('../services/auth.service');
const CloudinaryService = require('../services/cloudinary.service'); // <-- NUEVA IMPORTACIÓN

// Controladores
const SocioController = require('../controllers/socio.controller');
const ContenedorController = require('../controllers/contenedor.controller');
const LocalController = require('../controllers/locales.controller');
const ProductoController = require('../controllers/productos.controller');
const CategoriaController = require('../controllers/categorias.controller');
const OfertaController = require('../controllers/oferta.controller');
const AuthController = require('../controllers/auth.controller');

// Rutas (routers de API v1)
const DownloadSocios = require('../routes/api/v1.socio');
const DownloadContenedor = require('../routes/api/v1.contenedor');
const DownloadLocales = require('../routes/api/v1.locales');
const DownloadProductos = require('../routes/api/v1.productos');
const DownloadCategorias = require('../routes/api/v1.categorias');
const DownloadOfertas = require('../routes/api/v1.oferta');
const DownloadAuth = require('../routes/api/v1.auth');
const cloudinaryService = require('../services/cloudinary.service');

const config = {
  PORT: process.env.PORT || 3000,
  APPLICATION_NAME: 'Back-Base Project',
  API_URL: `http://localhost:${process.env.PORT || 3000}/v1/api`,
  JWT_SECRET: process.env.JWT_SECRET || 'supersecretkey_dev',
  JWT_EXPIRES_IN: process.env.JWT_EXPIRES_IN || '1h',
};

const container = createContainer();

container
  .register({
    // Modificar Routes para inyectar los controladores necesarios para las rutas públicas
    router: asFunction(Routes).inject(() => ({
      DownloadSocios: container.resolve('DownloadSocios'),
      DownloadContenedor: container.resolve('DownloadContenedor'),
      DownloadLocales: container.resolve('DownloadLocales'),
      DownloadProductos: container.resolve('DownloadProductos'),
      DownloadCategorias: container.resolve('DownloadCategorias'),
      DownloadOfertas: container.resolve('DownloadOfertas'),
      DownloadAuth: container.resolve('DownloadAuth'),
      // Inyectar controladores directamente para las rutas GET ALL públicas
      SocioController: container.resolve('SocioController'),
      ContenedorController: container.resolve('ContenedorController'),
      LocalController: container.resolve('LocalController'),
      ProductoController: container.resolve('ProductoController'),
      CategoriaController: container.resolve('CategoriaController'),
      OfertaController: container.resolve('OfertaController')
    })).singleton(),
    Server: asClass(Server).singleton(),
    config: asValue(config),
  })
  .register({
    SocioModel: asValue(SocioModel),
    ContenedorModel: asValue(ContenedorModel),
    LocalModel: asValue(LocalModel),
    ProductoModel: asValue(ProductoModel),
    CategoriaModel: asValue(CategoriaModel),
    OfertaModel: asValue(OfertaModel),
    UserModel: asValue(UserModel),
  })
  .register({
    SocioService: asClass(SocioService).singleton(),
    ContenedorService: asClass(ContenedorService).singleton(),
    // --- CAMBIO CLAVE AQUÍ: Inyectar LocalModel y CloudinaryService en LocalService ---
    LocalService: asClass(LocalService).inject(() => ({
      LocalModel: container.resolve('LocalModel'),
      CloudinaryService: container.resolve('CloudinaryService')
    })).singleton(),
    // ----------------------------------------------------------------------------------
    ProductoService: asClass(ProductoService).singleton(),
    CategoriaService: asClass(CategoriaService).singleton(),
    OfertaService: asClass(OfertaService).singleton(),
    AuthService: asClass(AuthService).inject(() => ({ UserModel: container.resolve('UserModel') })).singleton(),
    CloudinaryService: asClass(cloudinaryService).singleton(),
  })
  .register({
    SocioController: asClass(SocioController.bind(SocioController)).singleton(),
    ContenedorController: asClass(ContenedorController.bind(ContenedorController)).singleton(),
    LocalController: asClass(LocalController.bind(LocalController)).singleton(),
    ProductoController: asClass(ProductoController.bind(ProductoController)).singleton(),
    CategoriaController: asClass(CategoriaController.bind(CategoriaController)).singleton(),
    OfertaController: asClass(OfertaController.bind(OfertaController)).singleton(),
    AuthController: asClass(AuthController.bind(AuthController)).singleton(),
  })
  .register({
    DownloadSocios: asFunction(DownloadSocios).singleton(),
    DownloadContenedor: asFunction(DownloadContenedor).singleton(),
    DownloadLocales: asFunction(DownloadLocales).singleton(),
    DownloadProductos: asFunction(DownloadProductos).singleton(),
    DownloadCategorias: asFunction(DownloadCategorias).singleton(),
    DownloadOfertas: asFunction(DownloadOfertas).singleton(),
    DownloadAuth: asFunction(DownloadAuth).singleton(),
  });

module.exports = container;
