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
const CloudinaryService = require('../services/cloudinary.service');
const UserService = require('../services/user.service');

// Controladores
const SocioController = require('../controllers/socio.controller');
const ContenedorController = require('../controllers/contenedor.controller');
const LocalController = require('../controllers/locales.controller');
const ProductoController = require('../controllers/productos.controller');
const CategoriaController = require('../controllers/categorias.controller');
const OfertaController = require('../controllers/oferta.controller');
const AuthController = require('../controllers/auth.controller');
const UserController = require('../controllers/user.controller');

// Rutas (routers de API v1)
const DownloadSocios = require('../routes/api/v1.socio');
const DownloadContenedor = require('../routes/api/v1.contenedor');
const DownloadLocales = require('../routes/api/v1.locales');
const DownloadProductos = require('../routes/api/v1.productos');
const DownloadCategorias = require('../routes/api/v1.categorias');
const DownloadOfertas = require('../routes/api/v1.oferta');
const DownloadAuth = require('../routes/api/v1.auth');
const DownloadUser = require('../routes/api/v1.user');

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
    router: asFunction(Routes).inject(() => ({
      DownloadSocios: container.resolve('DownloadSocios'),
      DownloadContenedor: container.resolve('DownloadContenedor'),
      DownloadLocales: container.resolve('DownloadLocales'),
      DownloadProductos: container.resolve('DownloadProductos'),
      DownloadCategorias: container.resolve('DownloadCategorias'),
      DownloadOfertas: container.resolve('DownloadOfertas'),
      DownloadAuth: container.resolve('DownloadAuth'),
      DownloadUser: container.resolve('DownloadUser'),
      SocioController: container.resolve('SocioController'),
      ContenedorController: container.resolve('ContenedorController'),
      LocalController: container.resolve('LocalController'),
      ProductoController: container.resolve('ProductoController'),
      CategoriaController: container.resolve('CategoriaController'),
      OfertaController: container.resolve('OfertaController'),
      UserController: container.resolve('UserController'),
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
    LocalService: asClass(LocalService).inject(() => ({
      LocalModel: container.resolve('LocalModel'),
      CloudinaryService: container.resolve('CloudinaryService')
    })).singleton(),
    ProductoService: asClass(ProductoService).singleton(),
    CategoriaService: asClass(CategoriaService).singleton(),
    OfertaService: asClass(OfertaService).singleton(),
    AuthService: asClass(AuthService).inject(() => ({ UserModel: container.resolve('UserModel') })).singleton(),
    CloudinaryService: asClass(CloudinaryService).singleton(),
    UserService: asClass(UserService).inject(() => ({
      UserModel: container.resolve('UserModel'),
      LocalModel: container.resolve('LocalModel')
    })).singleton(),
  })
  .register({
    // Registros corregidos para que los controladores inyecten sus servicios
    SocioController: asClass(SocioController).inject(() => ({
      socioService: container.resolve('SocioService')
    })).singleton(),
    ContenedorController: asClass(ContenedorController).inject(() => ({
      contenedorService: container.resolve('ContenedorService')
    })).singleton(),
    LocalController: asClass(LocalController).inject(() => ({
      localService: container.resolve('LocalService')
    })).singleton(),
    ProductoController: asClass(ProductoController).inject(() => ({
      productoService: container.resolve('ProductoService')
    })).singleton(),
    CategoriaController: asClass(CategoriaController).inject(() => ({
      categoriaService: container.resolve('CategoriaService')
    })).singleton(),
    OfertaController: asClass(OfertaController).inject(() => ({
      ofertaService: container.resolve('OfertaService')
    })).singleton(),
    AuthController: asClass(AuthController).inject(() => ({
      authService: container.resolve('AuthService')
    })).singleton(),
    UserController: asClass(UserController).inject(() => ({
      userService: container.resolve('UserService')
    })).singleton(),
  })
  .register({
    DownloadSocios: asFunction(DownloadSocios).singleton(),
    DownloadContenedor: asFunction(DownloadContenedor).singleton(),
    DownloadLocales: asFunction(DownloadLocales).singleton(),
    DownloadProductos: asFunction(DownloadProductos).singleton(),
    DownloadCategorias: asFunction(DownloadCategorias).singleton(),
    DownloadOfertas: asFunction(DownloadOfertas).singleton(),
    DownloadAuth: asFunction(DownloadAuth).inject(() => ({
      AuthController: container.resolve('AuthController')
    })).singleton(),
    DownloadUser: asFunction(DownloadUser).inject(() => ({
      UserController: container.resolve('UserController')
    })).singleton(),
  });

module.exports = container;
