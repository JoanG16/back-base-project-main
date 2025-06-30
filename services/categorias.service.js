// backend/services/categoria.service.js
const catchServiceAsync = require('../utils/catch-service-async');
const BaseService = require('./base.service');

let _categoria = null;

module.exports = class CategoriaService extends BaseService {
  constructor({ CategoriaModel }) {
    super(CategoriaModel);
    _categoria = CategoriaModel;
  }

  getAllCategorias = catchServiceAsync(async () => {
    const results = await _categoria.findAll({
      order: [['nombre_categoria', 'ASC']]
    });
    return results;
  });

  getOneCategoria = catchServiceAsync(async (id) => {
    const result = await _categoria.findByPk(id);
    if (!result) {
      throw new Error(`Categoría con ID ${id} no encontrada`);
    }
    return result;
  });

  createCategoria = catchServiceAsync(async (body) => {
    const { nombre_categoria } = body;
    if (!nombre_categoria) {
      throw new Error('El nombre de la categoría es obligatorio.');
    }
    const newCategoria = await _categoria.create({ nombre_categoria });
    return newCategoria;
  });

  updateCategoria = catchServiceAsync(async (id, body) => {
    const categoria = await _categoria.findByPk(id);
    if (!categoria) {
      throw new Error(`Categoría con ID ${id} no encontrada`);
    }
    await categoria.update(body);
    return categoria;
  });

  deleteCategoria = catchServiceAsync(async (id) => {
    const categoria = await _categoria.findByPk(id);
    if (!categoria) {
      throw new Error(`Categoría con ID ${id} no encontrada`);
    }
    await categoria.destroy();
    return { message: 'Categoría eliminada correctamente' };
  });
};