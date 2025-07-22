// src/services/locales.service.js
const catchServiceAsync = require('../utils/catch-service-async');
const BaseService = require('./base.service');
const ProductoModel = require('../models/productos.models');
const CategoriaModel = require('../models/categorias.models');
const ContenedorModel = require('../models/contenedor.models'); // Asegúrate de que ContenedorModel sea necesario aquí, si no, puedes quitarlo.

// --- CAMBIO CLAVE: Eliminar la importación de saveBase64Image ---
// const { saveBase64Image } = require('../utils/image-uploader');

let _local = null;
let _cloudinaryService = null; // Variable para almacenar la instancia de CloudinaryService

module.exports = class LocalService extends BaseService {
  // --- CAMBIO CLAVE: Recibir CloudinaryService en el constructor ---
  constructor({ LocalModel, CloudinaryService }) {
    super(LocalModel);
    _local = LocalModel;
    _cloudinaryService = CloudinaryService; // Asignar la instancia de CloudinaryService
  }

  getProductosByLocal = catchServiceAsync(async (id_local) => {
    // Si este método es necesario, asegúrate de implementarlo correctamente.
    // Por ahora, mantiene el error.
    throw new Error("getProductosByLocal no implementado correctamente o _producto no definido.");
  });

  getAllLocales = catchServiceAsync(async () => {
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
    // Procesar solo las nuevas imágenes Base64
    if (body.imagen_urls && Array.isArray(body.imagen_urls) && body.imagen_urls.length > 0) {
      const uploadPromises = body.imagen_urls.map(async (url) => {
        // Solo sube si es una DataURL (nueva imagen), no si ya es una URL de Cloudinary
        if (typeof url === 'string' && url.startsWith('data:image/')) {
          return await _cloudinaryService.uploadImage(url, 'locales'); // Sube a la carpeta 'locales'
        }
        return url; // Si no es una DataURL, asume que es una URL existente y la mantiene
      });
      const results = await Promise.all(uploadPromises);
      newImageUrls = results.filter(url => url !== null); // Filtra cualquier null si hubo errores
    }
    // Asignar las URLs procesadas al cuerpo antes de crear el local
    body.imagen_urls = newImageUrls;

    const result = await _local.create(body);
    return { data: result };
  });

  updateLocal = catchServiceAsync(async (id, body) => {
    const local = await _local.findByPk(id);
    if (!local) {
      throw new Error(`Local con ID ${id} no encontrado`);
    }

    const oldImageUrls = local.imagen_urls || []; // URLs de imágenes actuales en la DB
    let updatedImageUrls = [];

    if (body.imagen_urls && Array.isArray(body.imagen_urls)) {
      const newImagesToUpload = [];
      const imagesToKeep = [];

      for (const url of body.imagen_urls) {
        if (typeof url === 'string' && url.startsWith('data:image/')) {
          newImagesToUpload.push(url); // Nuevas imágenes en Base64 para subir
        } else if (typeof url === 'string' && (url.startsWith('http://') || url.startsWith('https://'))) {
          imagesToKeep.push(url); // URLs existentes que el frontend quiere mantener
        }
      }

      // Subir las nuevas imágenes
      const uploadPromises = newImagesToUpload.map(url => _cloudinaryService.uploadImage(url, 'locales'));
      const newUploadedUrls = await Promise.all(uploadPromises);

      // Combinar las URLs que se quieren mantener y las nuevas subidas
      updatedImageUrls = [...imagesToKeep, ...newUploadedUrls.filter(url => url !== null)];

      // Identificar y eliminar imágenes antiguas que ya no están en `updatedImageUrls`
      const imagesToDelete = oldImageUrls.filter(url => !updatedImageUrls.includes(url));
      for (const url of imagesToDelete) {
        await _cloudinaryService.deleteImage(url); // Elimina de Cloudinary
      }

    } else {
      // Si body.imagen_urls no se envía o es vacío, se asume que se borran todas las imágenes
      // Eliminar todas las imágenes antiguas de Cloudinary
      for (const url of oldImageUrls) {
        await _cloudinaryService.deleteImage(url);
      }
      updatedImageUrls = [];
    }

    body.imagen_urls = updatedImageUrls; // Asignar el array de URLs actualizado al cuerpo

    await local.update(body);
    // Re-obtener el local con las relaciones actualizadas para la respuesta
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

  deleteLocal = catchServiceAsync(async (id) => {
    const local = await _local.findByPk(id);
    if (!local) {
      throw new Error(`Local con ID ${id} no encontrado`);
    }

    // --- CAMBIO CLAVE: Eliminar imágenes de Cloudinary antes de eliminar el local ---
    if (local.imagen_urls && Array.isArray(local.imagen_urls)) {
      for (const url of local.imagen_urls) {
        await _cloudinaryService.deleteImage(url); // Elimina de Cloudinary
      }
    }
    // ---------------------------------------------------------------------------------

    await local.destroy();
    return { data: local }; // Podrías devolver un mensaje de éxito en lugar del objeto eliminado
  });
};
