const catchControllerAsync = require('../utils/catch-controller-async');
const { appResponse } = require('../utils/app-response');
const BaseController = require('./base.controller');

let _ofertaService = null;

module.exports = class OfertaController extends BaseController {
  constructor({ OfertaService }) {
    super(OfertaService);
    _ofertaService = OfertaService;
  }

  // Maneja la obtención de todas las ofertas
  getAllOfertas = catchControllerAsync(async (req, res) => {
    const result = await _ofertaService.getAllOfertas();
    // Usa appResponse para enviar una respuesta estructurada
    return appResponse(res, { data: result });
  });

  // Maneja la obtención de una oferta por ID
  getOneOferta = catchControllerAsync(async (req, res) => {
    const { id } = req.params;
    const result = await _ofertaService.getOneOferta(id);
    return appResponse(res, { data: result });
  });

  // Maneja la creación de una nueva oferta
  createOferta = catchControllerAsync(async (req, res) => {
    const body = req.body;
    const result = await _ofertaService.createOferta(body);
    return appResponse(res, { data: result, statusCode: 201, message: 'Oferta creada correctamente' });
  });

  // Maneja la actualización de una oferta
  updateOferta = catchControllerAsync(async (req, res) => {
    const { id } = req.params;
    const body = req.body;
    const result = await _ofertaService.updateOferta(id, body);
    return appResponse(res, { data: result, message: 'Oferta actualizada correctamente' });
  });

  // Maneja la eliminación de una oferta
  deleteOferta = catchControllerAsync(async (req, res) => {
    const { id } = req.params;
    const result = await _ofertaService.deleteOferta(id);
    return appResponse(res, result); // El servicio ya devuelve un objeto { message: '...' }
  });
};
