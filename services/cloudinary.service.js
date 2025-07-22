// services/cloudinary.service.js
const cloudinary = require('cloudinary').v2;
const config = require('../config'); // Importa tu configuración

// Configura Cloudinary con tus credenciales
cloudinary.config({
    cloud_name: config.CLOUDINARY_CLOUD_NAME,
    api_key: config.CLOUDINARY_API_KEY,
    api_secret: config.CLOUDINARY_API_SECRET,
});

class CloudinaryService {
    /**
     * Sube una imagen en formato Base64 a Cloudinary.
     * @param {string} base64Image La imagen en formato Base64 (ej. "data:image/jpeg;base64,...").
     * @param {string} folder La carpeta en Cloudinary donde se guardará la imagen (ej. 'locales').
     * @returns {Promise<string>} Una promesa que resuelve con la URL segura de la imagen subida.
     */
    async uploadImage(base64Image, folder) {
        try {
            // Sube la imagen a Cloudinary
            const result = await cloudinary.uploader.upload(base64Image, {
                folder: `back-base-project/${folder}`, // Carpeta principal en Cloudinary + subcarpeta
                resource_type: 'image', // Asegura que se trate como imagen
            });
            console.log(`[CloudinaryService] Imagen subida a Cloudinary: ${result.secure_url}`);
            return result.secure_url; // Retorna la URL segura de la imagen
        } catch (error) {
            console.error('[CloudinaryService] Error al subir imagen a Cloudinary:', error);
            throw new Error('Error al subir imagen a Cloudinary.');
        }
    }

    /**
     * Elimina una imagen de Cloudinary.
     * @param {string} imageUrl La URL completa de la imagen en Cloudinary.
     * @returns {Promise<void>} Una promesa que resuelve cuando la imagen es eliminada.
     */
    async deleteImage(imageUrl) {
        try {
            // Extrae el public_id de la URL de Cloudinary
            // La URL es típicamente: https://res.cloudinary.com/<cloud_name>/image/upload/.../public_id.extension
            const publicIdMatch = imageUrl.match(/\/upload\/(?:v\d+\/)?(.*?)(?:\.\w+)?$/);
            if (!publicIdMatch || !publicIdMatch[1]) {
                console.warn(`[CloudinaryService] No se pudo extraer public_id de la URL: ${imageUrl}`);
                return; // No se puede eliminar si no se encuentra el public_id
            }
            // Cloudinary public_id incluye la carpeta si se especificó al subir
            // Asegúrate de que el public_id sea relativo a la carpeta raíz de Cloudinary si no se usó prefijo.
            // Si se subió a 'back-base-project/locales/imagen_id', el public_id será 'back-base-project/locales/imagen_id'
            const publicId = publicIdMatch[1];

            // Elimina la imagen
            const result = await cloudinary.uploader.destroy(publicId);
            console.log(`[CloudinaryService] Imagen eliminada de Cloudinary (public_id: ${publicId}):`, result);
        } catch (error) {
            console.error('[CloudinaryService] Error al eliminar imagen de Cloudinary:', error);
            // No lanzar error para que la operación principal no falle por la eliminación de imagen
        }
    }
}

module.exports = CloudinaryService;
