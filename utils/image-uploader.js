// src/utils/image-uploader.js
const fs = require('fs');
const path = require('path');
const { v4: uuidv4 } = require('uuid');

// CAMBIO CLAVE: Usar process.cwd() para la ruta base.
// Esto asume que el script de inicio (index.js) se ejecuta desde la raíz del proyecto.
const PROJECT_ROOT = process.cwd();
const IMAGES_UPLOAD_DIR = path.join(PROJECT_ROOT, 'public', 'uploads', 'locales');

console.log(`[Image Uploader DEBUG] Directorio de ejecución (process.cwd()): ${PROJECT_ROOT}`);
console.log(`[Image Uploader DEBUG] Ruta base de __dirname: ${__dirname}`);
console.log(`[Image Uploader DEBUG] Directorio final de subidas: ${IMAGES_UPLOAD_DIR}`); // Nuevo log para confirmar

// Asegúrate de que el directorio exista
if (!fs.existsSync(IMAGES_UPLOAD_DIR)) {
  try {
    fs.mkdirSync(IMAGES_UPLOAD_DIR, { recursive: true });
    console.log(`[Image Uploader DEBUG] Directorio de subidas creado: ${IMAGES_UPLOAD_DIR}`);
  } catch (mkdirError) {
    console.error(`[Image Uploader ERROR] Fallo al crear el directorio: ${IMAGES_UPLOAD_DIR}`, mkdirError);
  }
} else {
  console.log(`[Image Uploader DEBUG] Directorio de subidas ya existe: ${IMAGES_UPLOAD_DIR}`);
}

// Función auxiliar para decodificar Base64 y guardar la imagen
async function saveBase64Image(base64String) {
  if (!base64String || typeof base64String !== 'string' || !base64String.startsWith('data:image/')) {
    console.warn('[Image Uploader] String does not look like a Base64 image:', base64String ? base64String.substring(0, 50) + '...' : 'null/undefined');
    return null;
  }

  const matches = base64String.match(/^data:image\/([a-zA-Z0-9.]+);base64,(.+)$/);
  if (!matches || matches.length !== 3) {
    console.error('[Image Uploader ERROR] Invalid Base64 image format. Expected data:image/[extension];base64,[data]');
    return null;
  }

  const fileExtension = matches[1].split(';')[0];
  const base64Data = matches[2];
  const filename = `${uuidv4()}.${fileExtension}`;
  const filepath = path.join(IMAGES_UPLOAD_DIR, filename);

  console.log(`[Image Uploader DEBUG] Intentando guardar imagen en: ${filepath}`);
  try {
    await fs.promises.writeFile(filepath, base64Data, 'base64');
    const publicUrl = `/uploads/locales/${filename}`;
    console.log(`[Image Uploader DEBUG] Imagen guardada y URL generada: ${publicUrl}`);
    return publicUrl;
  } catch (error) {
    console.error(`[Image Uploader ERROR] Error al guardar imagen en ${filepath}:`, error);
    return null;
  }
}

module.exports = { saveBase64Image };
