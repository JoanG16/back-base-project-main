const catchServiceAsync = require('../utils/catch-service-async');
const BaseService = require('./base.service');

let _oferta = null;

module.exports = class OfertaService extends BaseService {
  constructor({ OfertaModel }) {
    super(OfertaModel);
    _oferta = OfertaModel;
  }

  // Obtiene todas las ofertas, ordenadas por 'orden' y luego por fecha de creación
  getAllOfertas = catchServiceAsync(async () => {
    const results = await _oferta.findAll({
      order: [['orden', 'ASC'], ['creado_en', 'DESC']]
    });
    return results;
  });

  // Obtiene una oferta por su ID
  getOneOferta = catchServiceAsync(async (id) => {
    const result = await _oferta.findByPk(id);
    if (!result) {
      throw new Error(`Oferta con ID ${id} no encontrada`);
    }
    return result;
  });

  // Crea una nueva oferta
  createOferta = catchServiceAsync(async (body) => {
    const { tipo_contenido, valor_contenido, orden, activo } = body;
    if (!tipo_contenido || !valor_contenido) {
      throw new Error('El tipo y valor de contenido son obligatorios para crear una oferta.');
    }
    const newOferta = await _oferta.create({
      tipo_contenido,
      valor_contenido,
      orden: orden || null, // Asigna 'orden' si se proporciona, de lo contrario null
      activo: activo !== undefined ? activo : true, // Asigna 'activo' si se proporciona, de lo contrario true
    });
    return newOferta;
  });

  // Actualiza una oferta existente
  updateOferta = catchServiceAsync(async (id, body) => {
    const oferta = await _oferta.findByPk(id);
    if (!oferta) {
      throw new Error(`Oferta con ID ${id} no encontrada`);
    }
    const { tipo_contenido, valor_contenido, orden, activo } = body;
    const updateData = {};
    // Solo actualiza los campos si están definidos en el 'body'
    if (tipo_contenido !== undefined) updateData.tipo_contenido = tipo_contenido;
    if (valor_contenido !== undefined) updateData.valor_contenido = valor_contenido;
    if (orden !== undefined) updateData.orden = orden;
    if (activo !== undefined) updateData.activo = activo;

    await oferta.update(updateData); // Aplica la actualización
    return oferta;
  });

  // Elimina una oferta por su ID
  deleteOferta = catchServiceAsync(async (id) => {
    const oferta = await _oferta.findByPk(id);
    if (!oferta) {
      throw new Error(`Oferta con ID ${id} no encontrada`);
    }
    await oferta.destroy(); // Elimina la oferta
    return { message: 'Oferta eliminada correctamente' }; // Retorna un mensaje de éxito
  });
};
