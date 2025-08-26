// controllers/local.controller.js
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
    // Ahora solo devuelve los locales activos por defecto
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
    const result = await _localService.createLocal(body);
    return appResponse(res, result);
  });

  updateLocal = catchControllerAsync(async (req, res) => {
    const { id } = req.params;
    const body = req.body;
    const result = await _localService.updateLocal(id, body);
    return appResponse(res, result);
  });

  // --- CAMBIO: Controlador para desactivar un local (ya no lo elimina) ---
  deleteLocal = catchControllerAsync(async (req, res) => {
    const { id } = req.params;
    const result = await _localService.deleteLocal(id);
    return appResponse(res, result);
  });

  // --- NUEVO: Controlador para activar un local ---
  activateLocal = catchControllerAsync(async (req, res) => {
    const { id } = req.params;
    const result = await _localService.activateLocal(id);
    return appResponse(res, result);
  });

  downloadLocalesExcel = catchControllerAsync(async (req, res) => {
    try {
      const { data: buffer } = await _localService.generateLocalesExcel();
      res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
      res.setHeader('Content-Disposition', 'attachment; filename=locales-reporte.xlsx');
      res.send(buffer);
    } catch (error) {
      console.error('Error al generar el reporte de Excel:', error);
      res.status(500).json({
        success: false,
        message: 'Error interno del servidor al generar el reporte de Excel.',
        error: error.message
      });
    }
  });
};