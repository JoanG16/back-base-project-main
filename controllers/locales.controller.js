const catchControllerAsync = require('../utils/catch-controller-async');
const { appResponse } = require('../utils/app-response');
const BaseController = require('./base.controller');

let _localService = null;

module.exports = class LocalController extends BaseController {
  constructor({ LocalService }) {
    super(LocalService);
    _localService = LocalService;
  }

  getAllLocales = catchControllerAsync(async (req, res) => {
    const result = await _localService.getAllLocales();
    return appResponse(res, result);
  });

  getOneLocal = catchControllerAsync(async (req, res) => {
    const { id } = req.params;
    const result = await _localService.getOneLocal(id);
    return appResponse(res, result);
  });

  createLocal = catchControllerAsync(async (req, res) => {
    const body = req.body;
    const result = await _localService.createLocal(body); // Ahora el servicio maneja las imágenes
    return appResponse(res, result);
  });

  updateLocal = catchControllerAsync(async (req, res) => {
    const { id } = req.params;
    const body = req.body;
    const result = await _localService.updateLocal(id, body); // Ahora el servicio maneja las imágenes
    return appResponse(res, result);
  });

  deleteLocal = catchControllerAsync(async (req, res) => {
    const { id } = req.params;
    const result = await _localService.deleteLocal(id);
    return appResponse(res, result);
  });

  // Este endpoint no parece usarse o está malreferenciado en tu código de servicio.
  // Si deseas agregar productos a un local, la lógica debería estar en el servicio.
  // getProductosByLocal = catchControllerAsync(async (req, res) => {
  //   const productos = await Producto.findAll({ where: { id_local: req.params.id } });
  //   res.json(productos);
  // });

  createProductoForLocal = catchControllerAsync(async (req, res) => {
    const { id } = req.params; // id del local
    // Asegúrate de que addProductoToLocal exista en LocalService si este endpoint se usa.
    // const producto = await _localService.addProductoToLocal(id, req.body);
    // return appResponse(res, producto);
    return appResponse(res, { message: "Endpoint createProductoForLocal no implementado correctamente." });
  });

};
