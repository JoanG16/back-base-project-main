const catchControllerAsync = require('../utils/catch-controller-async');
const { appResponse } = require('../utils/app-response');
const BaseController = require('./base.controller');

let _categoriaService = null;

module.exports = class CategoriaController extends BaseController {
  constructor({ CategoriaService }) {
    super(CategoriaService);
    _categoriaService = CategoriaService;
  }

  // CORRECCIÓN: Envolver el resultado en un objeto 'data'
  getAllCategorias = catchControllerAsync(async (req, res) => {
    const result = await _categoriaService.getAllCategorias();
    return appResponse(res, { data: result }); // <-- CAMBIO CLAVE AQUÍ
  });

  // CORRECCIÓN: También en getOneCategoria para mantener la consistencia
  getOneCategoria = catchControllerAsync(async (req, res) => {
    const { id } = req.params;
    const result = await _categoriaService.getOneCategoria(id);
    return appResponse(res, { data: result }); // <-- CAMBIO CLAVE AQUÍ
  });

  // createCategoria y updateCategoria ya pueden devolver el objeto directamente si el servicio lo hace
  // o también puedes envolverlos en { data: result } si prefieres consistencia total en el controlador
  createCategoria = catchControllerAsync(async (req, res) => {
    const body = req.body;
    const result = await _categoriaService.createCategoria(body);
    // Asumiendo que createCategoria en el servicio devuelve directamente el objeto creado
    return appResponse(res, { data: result, statusCode: 201, message: 'Categoría creada correctamente' });
  });

  updateCategoria = catchControllerAsync(async (req, res) => {
    const { id } = req.params;
    const body = req.body;
    const result = await _categoriaService.updateCategoria(id, body);
    // Asumiendo que updateCategoria en el servicio devuelve directamente el objeto actualizado
    return appResponse(res, { data: result, message: 'Categoría actualizada correctamente' });
  });

  deleteCategoria = catchControllerAsync(async (req, res) => {
    const { id } = req.params;
    const result = await _categoriaService.deleteCategoria(id);
    return appResponse(res, result); // El servicio ya devuelve { message }
  });
};
