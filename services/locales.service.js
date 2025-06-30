// src/services/locales.service.js
const catchServiceAsync = require('../utils/catch-service-async');
const BaseService = require('./base.service');
const ProductoModel = require('../models/productos.models');
const CategoriaModel = require('../models/categorias.models');
const ContenedorModel = require('../models/contenedor.models');

// Importa la función de utilidad para guardar imágenes
const { saveBase64Image } = require('../utils/image-uploader'); // CAMBIO CLAVE: Importación de la utilidad

let _local = null;

module.exports = class LocalService extends BaseService {
  constructor({ LocalModel }) {
    super(LocalModel);
    _local = LocalModel;
  }

  getProductosByLocal = catchServiceAsync(async (id_local) => {
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
      // Usar la función importada
      const uploadPromises = body.imagen_urls.map(url => saveBase64Image(url));
      const results = await Promise.all(uploadPromises);
      newImageUrls = results.filter(url => url !== null);
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

    let updatedImageUrls = [];
    if (body.imagen_urls && Array.isArray(body.imagen_urls)) {
      // Filtrar y procesar las nuevas imágenes (Base64)
      const newImagesToSave = body.imagen_urls.filter(url => typeof url === 'string' && url.startsWith('data:image/'));
      const existingUrlsToKeep = body.imagen_urls.filter(url => typeof url === 'string' && !url.startsWith('data:image/'));

      // Usar la función importada
      const uploadPromises = newImagesToSave.map(url => saveBase64Image(url));
      const newSavedUrls = await Promise.all(uploadPromises);

      // Combinar URLs existentes y las nuevas URLs guardadas
      updatedImageUrls = [...existingUrlsToKeep, ...newSavedUrls.filter(url => url !== null)];
    } else {
      updatedImageUrls = []; // Si no se envían URLs, se asume que se borran todas las imágenes
    }

    // Opcional: Eliminar archivos antiguos del servidor que ya no están en `updatedImageUrls`
    // Esto requiere comparar `local.imagen_urls` con `updatedImageUrls`
    // y eliminar los que no están presentes en `updatedImageUrls`.
    // Por simplicidad, esta lógica no está implementada aquí, pero es importante para la limpieza.

    // Asignar el array de URLs actualizado al cuerpo
    body.imagen_urls = updatedImageUrls;

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
    // Opcional: Lógica para eliminar los archivos de imagen asociados al local
    // si local.imagen_urls es un array de URLs de archivos locales
    // if (local.imagen_urls && Array.isArray(local.imagen_urls)) {
    //     local.imagen_urls.forEach(url => {
    //         const filename = path.basename(url);
    //         const filepath = path.join(IMAGES_UPLOAD_DIR, filename);
    //         if (fs.existsSync(filepath)) {
    //             fs.unlinkSync(filepath);
    //         }
    //     });
    // }

    await local.destroy();
    return { data: local }; // Podrías devolver un mensaje de éxito en lugar del objeto eliminado
  });

};
