const catchServiceAsync = require('../utils/catch-service-async');
const BaseService = require('./base.service');

let _socio = null;

module.exports = class SocioService extends BaseService {
  constructor({ SocioModel }) {
    super(SocioModel);
    _socio = SocioModel;
  }

  getAllSocios = catchServiceAsync(async () => {
    const result = await _socio.findAll();
    return { data: result };
  });

  getOneSocio = catchServiceAsync(async (id) => {
    const result = await _socio.findByPk(id);
    if (!result) {
      throw new Error(`Socio con ID ${id} no encontrado`);
    }
    return { data: result };
  });

  createSocio = catchServiceAsync(async (body) => {
    const result = await _socio.create(body);
    return { data: result };
  });

  updateSocio = catchServiceAsync(async (id, body) => {
    const socio = await _socio.findByPk(id);
    if (!socio) {
      throw new Error(`Socio con ID ${id} no encontrado`);
    }
    await socio.update(body);
    return { data: socio };
  });

  deleteSocio = catchServiceAsync(async (id) => {
    const socio = await _socio.findByPk(id);
    if (!socio) {
      throw new Error(`Socio con ID ${id} no encontrado`);
    }
    await socio.destroy();
    return { data: socio };
  });
};
