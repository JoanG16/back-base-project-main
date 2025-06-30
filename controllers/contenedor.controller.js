const catchControllerAsync = require('../utils/catch-controller-async');
const { appResponse } = require('../utils/app-response');
const BaseController = require('./base.controller');

let _contenedorService = null;

module.exports = class ContenedorController extends BaseController {
  constructor({ ContenedorService }) {
    super(ContenedorService);
    _contenedorService = ContenedorService;
  }

  getAllContenedores = catchControllerAsync(async (req, res) => {
    const result = await _contenedorService.getAllContenedores();
    return appResponse(res, { data: result });
  });

  getUniqueBloques = catchControllerAsync(async (req, res) => {
    const result = await _contenedorService.getUniqueBloques();
    return appResponse(res, { data: result });
  });

  getContenedoresGeo = catchControllerAsync(async (req, res) => {
    const result = await _contenedorService.getContenedoresWithGeojson();
    return appResponse(res, result);
  });



  getOneContenedor = catchControllerAsync(async (req, res) => {
    const { id } = req.params;
    const result = await _contenedorService.getOneContenedor(id);
    return appResponse(res, result);
  });

  createContenedor = catchControllerAsync(async (req, res) => {
    const body = req.body;
    console.log('BODY CONTENEDOR:', body);
    const result = await _contenedorService.createContenedor(body);
    return appResponse(res, result);
  });

  updateContenedor = catchControllerAsync(async (req, res) => {
    const { id } = req.params;
    const body = req.body;
    const result = await _contenedorService.updateContenedor(id, body);
    return appResponse(res, result);
  });

  deleteContenedor = catchControllerAsync(async (req, res) => {
    const { id } = req.params;
    const result = await _contenedorService.deleteContenedor(id);
    return appResponse(res, result);
  });
};
