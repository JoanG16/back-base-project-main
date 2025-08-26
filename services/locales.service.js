
// src/services/locales.service.js
const catchServiceAsync = require('../utils/catch-service-async');
const BaseService = require('./base.service');
const ProductoModel = require('../models/productos.models');
const CategoriaModel = require('../models/categorias.models');
const ContenedorModel = require('../models/contenedor.models');
const ExcelJS = require('exceljs');

let _local = null;
let _cloudinaryService = null;

module.exports = class LocalService extends BaseService {
  constructor({ LocalModel, CloudinaryService }) {
    super(LocalModel);
    _local = LocalModel;
    _cloudinaryService = CloudinaryService;
  }

 getAllLocalesWithStatus = catchServiceAsync(async () => {
    const result = await _local.findAll({
      include: [
        {
          model: ProductoModel,
          as: 'productos',
          through: { attributes: [] },
          include: [{
            model: CategoriaModel,
            as: 'categoria',
            attributes: ['id_categoria', 'nombre_categoria']
          }]
        },
      ]
    });
    return { data: result };
  });

  // Método para obtener todos los locales (solo los activos por defecto)
  getAllLocales = catchServiceAsync(async () => {
    const result = await _local.findAll({
      where: { activo: true }, // Solo locales activos
      include: [
        {
          model: ProductoModel,
          as: 'productos',
          through: { attributes: [] },
          include: [{
            model: CategoriaModel,
            as: 'categoria',
            attributes: ['id_categoria', 'nombre_categoria']
          }]
        },
      ]
    });
    return { data: result };
  });

  // Obtener un solo local (sin importar si está activo o no, útil para el admin)
  getOneLocal = catchServiceAsync(async (id) => {
    const result = await _local.findByPk(id, {
      include: [
        {
          model: ProductoModel,
          as: 'productos',
          through: { attributes: [] },
          include: [{
            model: CategoriaModel,
            as: 'categoria',
            attributes: ['id_categoria', 'nombre_categoria']
          }]
        }
      ]
    });
    if (!result) {
      throw new Error(`Local con ID ${id} no encontrado`);
    }
    return { data: result };
  });

  createLocal = catchServiceAsync(async (body) => {
    let newImageUrls = [];
    if (body.imagen_urls && Array.isArray(body.imagen_urls) && body.imagen_urls.length > 0) {
      const uploadPromises = body.imagen_urls.map(async (url) => {
        if (typeof url === 'string' && url.startsWith('data:image/')) {
          return await _cloudinaryService.uploadImage(url, 'locales');
        }
        return url;
      });
      const results = await Promise.all(uploadPromises);
      newImageUrls = results.filter(url => url !== null);
    }
    body.imagen_urls = newImageUrls;
    const result = await _local.create(body);
    return { data: result };
  });

  updateLocal = catchServiceAsync(async (id, body) => {
    const local = await _local.findByPk(id);
    if (!local) {
      throw new Error(`Local con ID ${id} no encontrado`);
    }

    const oldImageUrls = local.imagen_urls || [];
    let updatedImageUrls = [];

    if (body.imagen_urls && Array.isArray(body.imagen_urls)) {
      const newImagesToUpload = [];
      const imagesToKeep = [];

      for (const url of body.imagen_urls) {
        if (typeof url === 'string' && url.startsWith('data:image/')) {
          newImagesToUpload.push(url);
        } else if (typeof url === 'string' && (url.startsWith('http://') || url.startsWith('https://'))) {
          imagesToKeep.push(url);
        }
      }

      const uploadPromises = newImagesToUpload.map(url => _cloudinaryService.uploadImage(url, 'locales'));
      const newUploadedUrls = await Promise.all(uploadPromises);

      updatedImageUrls = [...imagesToKeep, ...newUploadedUrls.filter(url => url !== null)];

      const imagesToDelete = oldImageUrls.filter(url => !updatedImageUrls.includes(url));
      for (const url of imagesToDelete) {
        await _cloudinaryService.deleteImage(url);
      }

    } else {
      for (const url of oldImageUrls) {
        await _cloudinaryService.deleteImage(url);
      }
      updatedImageUrls = [];
    }

    body.imagen_urls = updatedImageUrls;

    await local.update(body);
    const updatedLocal = await _local.findByPk(id, {
      include: [
        {
          model: ProductoModel,
          as: 'productos',
          through: { attributes: [] },
          include: [{
            model: CategoriaModel,
            as: 'categoria',
            attributes: ['id_categoria', 'nombre_categoria']
          }]
        }
      ]
    });
    return { data: updatedLocal };
  });

  // --- CAMBIO IMPORTANTE: Ahora este método DEACTIVA en lugar de ELIMINAR ---
  deleteLocal = catchServiceAsync(async (id) => {
    const local = await _local.findByPk(id);
    if (!local) {
      throw new Error(`Local con ID ${id} no encontrado`);
    }
    // Actualizar el estado a inactivo
    await local.update({ activo: false });
    return { data: local };
  });

  // --- NUEVO: Método para activar un local ---
  activateLocal = catchServiceAsync(async (id) => {
    const local = await _local.findByPk(id);
    if (!local) {
      throw new Error(`Local con ID ${id} no encontrado`);
    }
    // Actualizar el estado a activo
    await local.update({ activo: true });
    return { data: local };
  });

  generateLocalesExcel = catchServiceAsync(async () => {
    const { data: locales } = await this.getAllLocales();

    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('Locales');

    worksheet.columns = [
      { header: 'ID', key: 'id_local', width: 10 },
      { header: 'Nombre del Negocio', key: 'nombre_del_negocio', width: 30 },
      { header: 'Nombre del Dueño', key: 'nombre_del_dueno', width: 30 },
      { header: 'Código del Local', key: 'codigo_local', width: 20 },
      { header: 'RUC', key: 'ruc', width: 20 },
      { header: 'Correo', key: 'correo', width: 30 },
      { header: 'Teléfono', key: 'telefono', width: 20 },
      { header: 'Descripción', key: 'descripcion', width: 50 },
      { header: 'Productos', key: 'productos', width: 50 },
    ];

    locales.forEach(local => {
      const productosText = local.productos.map(p => {
        const categoria = p.categoria ? ` (${p.categoria.nombre_categoria})` : '';
        return `${p.nombre_producto}${categoria}`;
      }).join(', ');

      worksheet.addRow({
        id_local: local.id_local,
        nombre_del_negocio: local.nombre_del_negocio,
        nombre_del_dueno: local.nombre_del_dueno,
        codigo_local: local.codigo_local,
        ruc: local.ruc,
        correo: local.correo,
        telefono: local.telefono,
        descripcion: local.descripcion,
        productos: productosText,
      });
    });

    const buffer = await workbook.xlsx.writeBuffer();
    return { data: buffer };
  });
};
