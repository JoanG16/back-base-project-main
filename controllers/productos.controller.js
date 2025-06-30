const catchControllerAsync = require('../utils/catch-controller-async');
const { appResponse } = require('../utils/app-response');
const BaseController = require('./base.controller');

let _productoService = null;

module.exports = class ProductoController extends BaseController {
  constructor({ ProductoService }) {
    super(ProductoService);
    _productoService = ProductoService;
  }

  getAllProductos = catchControllerAsync(async (req, res) => {
    const result = await _productoService.getAllProductos();
    return appResponse(res, { data: result });
  });

  getOneProducto = catchControllerAsync(async (req, res) => {
    const { id } = req.params;
    const result = await _productoService.getOneProducto(id);
    return appResponse(res, result);
  });

  createProducto = catchControllerAsync(async (req, res) => {
    const body = req.body;
    const result = await _productoService.createProducto(body);
    return appResponse(res, result);
  });

  updateProducto = catchControllerAsync(async (req, res) => {
    const { id } = req.params;
    const body = req.body;
    const result = await _productoService.updateProducto(id, body);
    return appResponse(res, result);
  });

  deleteProducto = catchControllerAsync(async (req, res) => {
    const { id } = req.params;
    const result = await _productoService.deleteProducto(id);
    return appResponse(res, result);
  });
};
