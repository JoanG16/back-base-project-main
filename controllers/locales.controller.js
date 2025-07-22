// controllers/local.controller.js
const catchControllerAsync = require('../utils/catch-controller-async');
const { appResponse } = require('../utils/app-response');
const BaseController = require('./base.controller');

let _localService = null;

module.exports = class LocalController extends BaseController {
  // El constructor solo necesita LocalService, ya que este último manejará Cloudinary.
  constructor({ LocalService }) {
    super(LocalService);
    _localService = LocalService;
  }

  getAllLocales = catchControllerAsync(async (req, res) => {
    // El servicio ya devolverá las URLs de Cloudinary
    const result = await _localService.getAllLocales();
    return appResponse(res, result);
  });

  getOneLocal = catchControllerAsync(async (req, res) => {
    // El servicio ya devolverá las URLs de Cloudinary
    const { id } = req.params;
    const result = await _localService.getOneLocal(id);
    return appResponse(res, result);
  });

  createLocal = catchControllerAsync(async (req, res) => {
    const body = req.body;
    // El servicio ahora se encargará de subir las imágenes a Cloudinary
    // y guardar las URLs resultantes en la base de datos.
    const result = await _localService.createLocal(body);
    return appResponse(res, result);
  });

  updateLocal = catchControllerAsync(async (req, res) => {
    const { id } = req.params;
    const body = req.body;
    // El servicio ahora se encargará de actualizar las imágenes en Cloudinary
    // (subir nuevas, mantener existentes, eliminar viejas si aplica)
    // y guardar las URLs resultantes en la base de datos.
    const result = await _localService.updateLocal(id, body);
    return appResponse(res, result);
  });

  deleteLocal = catchControllerAsync(async (req, res) => {
    const { id } = req.params;
    // El servicio ahora se encargará de eliminar las imágenes asociadas de Cloudinary
    // antes de eliminar el registro del local de la base de datos.
    const result = await _localService.deleteLocal(id);
    return appResponse(res, result);
  });

  // Este endpoint no parece usarse o está malreferenciado en tu código de servicio.
  // Si deseas agregar productos a un local, la lógica debería estar en el servicio.
   getProductosByLocal = catchControllerAsync(async (req, res) => {
   const productos = await Producto.findAll({ where: { id_local: req.params.id } });
    res.json(productos);
  });

  createProductoForLocal = catchControllerAsync(async (req, res) => {
    const { id } = req.params; // id del local
    // Asegúrate de que addProductoToLocal exista en LocalService si este endpoint se usa.
    // const producto = await _localService.addProductoToLocal(id, req.body);
    // return appResponse(res, producto);
    return appResponse(res, { message: "Endpoint createProductoForLocal no implementado correctamente." });
  });
};
