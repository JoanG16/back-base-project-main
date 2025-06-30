const { createContainer, asClass, asFunction, asValue } = require('awilix');

const Routes = require('../routes');
const Server = require('../startup/server');

// Modelos
const SocioModel = require('../models/socio.models');
const ContenedorModel = require('../models/contenedor.models');
const LocalModel = require('../models/locales.models');
const ProductoModel = require('../models/productos.models');
const CategoriaModel = require('../models/categorias.models');
const OfertaModel = require('../models/oferta.model'); // Asegúrate de que la ruta y extensión sean correctas

// Servicios
const SocioService = require('../services/socio.service');
const ContenedorService = require('../services/contenedor.service');
const LocalService = require('../services/locales.service');
const ProductoService = require('../services/productos.service');
const CategoriaService = require('../services/categorias.service');
const OfertaService = require('../services/oferta.service');

// Controladores
const SocioController = require('../controllers/socio.controller');
const ContenedorController = require('../controllers/contenedor.controller');
const LocalController = require('../controllers/locales.controller');
const ProductoController = require('../controllers/productos.controller');
const CategoriaController = require('../controllers/categorias.controller');
const OfertaController = require('../controllers/oferta.controller');

// Rutas de Descarga (routers de API v1)
const DownloadSocios = require('../routes/api/v1.socio');
const DownloadContenedor = require('../routes/api/v1.contenedor');
const DownloadLocales = require('../routes/api/v1.locales');
const DownloadProductos = require('../routes/api/v1.productos');
const DownloadCategorias = require('../routes/api/v1.categorias');
const DownloadOfertas = require('../routes/api/v1.oferta'); // Asegúrate de que la ruta y extensión sean correctas

// DEFINICIÓN Y REGISTRO DEL OBJETO DE CONFIGURACIÓN
// Estos valores se pasarán al constructor de la clase Server.
const config = {
  PORT: process.env.PORT || 3000,
  APPLICATION_NAME: 'Back-Base Project',
  API_URL: `http://localhost:${process.env.PORT || 3000}/v1/api`, // Ajusta esta URL si es diferente
};

const container = createContainer();

container
  .register({
    router: asFunction(Routes).singleton(),
    Server: asClass(Server).singleton(),
    config: asValue(config), // REGISTRO DE LA CONFIGURACIÓN: crucial para que Server la reciba
  })
  .register({
    SocioModel: asValue(SocioModel),
    ContenedorModel: asValue(ContenedorModel),
    LocalModel: asValue(LocalModel),
    ProductoModel: asValue(ProductoModel),
    CategoriaModel: asValue(CategoriaModel),
    OfertaModel: asValue(OfertaModel),
  })
  .register({
    SocioService: asClass(SocioService).singleton(),
    ContenedorService: asClass(ContenedorService).singleton(),
    LocalService: asClass(LocalService).singleton(),
    ProductoService: asClass(ProductoService).singleton(),
    CategoriaService: asClass(CategoriaService).singleton(),
    OfertaService: asClass(OfertaService).singleton(),
  })
  .register({
    SocioController: asClass(SocioController.bind(SocioController)).singleton(),
    ContenedorController: asClass(ContenedorController.bind(ContenedorController)).singleton(),
    LocalController: asClass(LocalController.bind(LocalController)).singleton(),
    ProductoController: asClass(ProductoController.bind(ProductoController)).singleton(),
    CategoriaController: asClass(CategoriaController.bind(CategoriaController)).singleton(),
    OfertaController: asClass(OfertaController.bind(OfertaController)).singleton(),
  })
  .register({
    DownloadSocios: asFunction(DownloadSocios).singleton(),
    DownloadContenedor: asFunction(DownloadContenedor).singleton(),
    DownloadLocales: asFunction(DownloadLocales).singleton(),
    DownloadProductos: asFunction(DownloadProductos).singleton(),
    DownloadCategorias: asFunction(DownloadCategorias).singleton(),
    DownloadOfertas: asFunction(DownloadOfertas).singleton(),
  });

module.exports = container;
