const catchControllerAsync = require('../utils/catch-controller-async');
const { appResponse } = require('../utils/app-response');
const BaseController = require('./base.controller');

let _socioService = null;

module.exports = class SocioController extends BaseController {
  constructor({ SocioService }) {
    super(SocioService);
    _socioService = SocioService;
  }

  getAllSocios = catchControllerAsync(async (req, res) => {
    const result = await _socioService.getAllSocios();
    return appResponse(res, result);
  });

  getOneSocio = catchControllerAsync(async (req, res) => {
    const { id } = req.params;
    const result = await _socioService.getOneSocio(id);
    return appResponse(res, result);
  });

 createSocio = catchControllerAsync(async (req, res) => {
  const body = req.body;
  console.log('BODY RECIBIDO:', body); 
  const result = await _socioService.createSocio(body);
  return appResponse(res, result);
});

  updateSocio = catchControllerAsync(async (req, res) => {
    const { id } = req.params;
    const body = req.body;
    const result = await _socioService.updateSocio(id, body);
    return appResponse(res, result);
  });

  deleteSocio = catchControllerAsync(async (req, res) => {
    const { id } = req.params;
    const result = await _socioService.deleteSocio(id);
    return appResponse(res, result);
  });
};
