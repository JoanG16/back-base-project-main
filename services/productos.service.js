// backend/services/producto.service.js
const catchServiceAsync = require('../utils/catch-service-async');
const BaseService = require('./base.service');
const CategoriaModel = require('../models/categorias.models'); // Asegúrate de tener este modelo
const LocalModel = require('../models/locales.models'); // Asegúrate de tener este modelo
const LocalProductoModel = require('../models/local_producto.models'); // Tu modelo de tabla pivote

let _producto = null;

module.exports = class ProductoService extends BaseService {
  constructor({ ProductoModel }) {
    super(ProductoModel);
    _producto = ProductoModel;
  }

  getAllProductos = catchServiceAsync(async () => {
    const results = await _producto.findAll({
      include: [
        { model: CategoriaModel, as: 'categoria', attributes: ['id_categoria', 'nombre_categoria'] },
        { model: LocalModel, as: 'locales', attributes: ['id_local', 'nombre_del_negocio'], through: { attributes: [] } }
      ],
      order: [['nombre', 'ASC']]
    });
    return results;
  });

  getOneProducto = catchServiceAsync(async (id) => {
    const result = await _producto.findByPk(id, {
      include: [
        { model: CategoriaModel, as: 'categoria', attributes: ['id_categoria', 'nombre_categoria'] },
        { model: LocalModel, as: 'locales', attributes: ['id_local', 'nombre_del_negocio'], through: { attributes: [] } }
      ]
    });
    if (!result) {
      throw new Error(`Producto con ID ${id} no encontrado`);
    }
    return result;
  });

  createProducto = catchServiceAsync(async (body) => {
    const { nombre, descripcion_adicional, id_categoria, locales } = body; // REMOVIDO: precio

    if (!nombre || !id_categoria || !locales || !Array.isArray(locales) || locales.length === 0) { // REMOVIDO: validación de precio
      throw new Error('Nombre, categoría y al menos un local son obligatorios para crear un producto.');
    }

    const newProducto = await _producto.create({
      nombre,
      // REMOVIDO: precio,
      descripcion_adicional,
      id_categoria
    });

    if (locales && locales.length > 0) {
      await newProducto.setLocales(locales);
    }

    const resultWithAssociations = await _producto.findByPk(newProducto.id_producto, {
      include: [
        { model: CategoriaModel, as: 'categoria', attributes: ['id_categoria', 'nombre_categoria'] },
        { model: LocalModel, as: 'locales', attributes: ['id_local', 'nombre_del_negocio'], through: { attributes: [] } }
      ]
    });

    return resultWithAssociations;
  });

  updateProducto = catchServiceAsync(async (id, body) => {
    const producto = await _producto.findByPk(id);
    if (!producto) {
      throw new Error(`Producto con ID ${id} no encontrado`);
    }

    const { nombre, descripcion_adicional, id_categoria, locales } = body; // REMOVIDO: precio
    const updateData = {};
    if (nombre !== undefined) updateData.nombre = nombre;
    // REMOVIDO:
    // if (precio !== undefined) updateData.precio = precio;
    if (descripcion_adicional !== undefined) updateData.descripcion_adicional = descripcion_adicional;
    if (id_categoria !== undefined) updateData.id_categoria = id_categoria;

    await producto.update(updateData);

    if (locales !== undefined) {
      await producto.setLocales(locales);
    }

    const updatedProducto = await _producto.findByPk(id, {
      include: [
        { model: CategoriaModel, as: 'categoria', attributes: ['id_categoria', 'nombre_categoria'] },
        { model: LocalModel, as: 'locales', attributes: ['id_local', 'nombre_del_negocio'], through: { attributes: [] } }
      ]
    });

    return updatedProducto;
  });

  deleteProducto = catchServiceAsync(async (id) => {
    const producto = await _producto.findByPk(id);
    if (!producto) {
      throw new Error(`Producto con ID ${id} no encontrado`);
    }
    await producto.destroy();
    return { message: 'Producto eliminado correctamente' };
  });
};
