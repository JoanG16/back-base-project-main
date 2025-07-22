// migrate-images-pg.js

// Carga las variables de entorno desde el archivo .env
require('dotenv').config();

// Importa las librerías necesarias
const { Pool } = require('pg'); // Cliente PostgreSQL
const cloudinary = require('cloudinary').v2; // SDK de Cloudinary
const fs = require('fs').promises; // Módulo de Node.js para operaciones de archivos (versión con promesas)
const path = require('path'); // Módulo de Node.js para manejar rutas de archivos

// --- Configuración de PostgreSQL ---
// No se usa PG_URI ya que las variables de conexión están separadas en .env
// const PG_URI = process.env.PG_URI; 

// Obtiene las variables de entorno de PostgreSQL
const PG_HOST = process.env.DB_HOST; // Usando DB_HOST de tu .env
const PG_USER = process.env.DB_USER; // Usando DB_USER de tu .env
const PG_PASSWORD = process.env.DB_PASSWORD; // Usando DB_PASSWORD de tu .env
const PG_DATABASE = process.env.DB_NAME; // Usando DB_NAME de tu .env
const PG_PORT = process.env.DB_PORT || 5432; // Usando DB_PORT de tu .env, con 5432 como fallback

// Crea un pool de conexiones a PostgreSQL
const pool = new Pool({
    host: PG_HOST,
    user: PG_USER,
    password: PG_PASSWORD,
    database: PG_DATABASE,
    port: PG_PORT,
});

// Verifica que la configuración de PostgreSQL esté definida
if (!PG_HOST || !PG_USER || !PG_PASSWORD || !PG_DATABASE) {
    console.error('Error: Las variables de entorno de PostgreSQL (DB_HOST, DB_USER, DB_PASSWORD, DB_NAME) no están definidas.');
    process.exit(1);
}

// --- Configuración de Cloudinary ---
// Configura Cloudinary con tus credenciales
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
});

// Verifica que las credenciales de Cloudinary estén definidas
if (!process.env.CLOUDINARY_CLOUD_NAME || !process.env.CLOUDINARY_API_KEY || !process.env.CLOUDINARY_API_SECRET) {
    console.error('Error: Las credenciales de Cloudinary (CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, CLOUDINARY_API_SECRET) no están definidas en las variables de entorno.');
    process.exit(1);
}

// --- Lógica de Migración ---
// Define la ruta base donde se encuentran tus imágenes locales.
// Ajusta esta ruta si tu carpeta 'public/uploads/locales' está en una ubicación diferente
// con respecto a donde coloques este script 'migrate-images-pg.js'.
const PUBLIC_UPLOADS_DIR = path.resolve(__dirname, 'public', 'uploads', 'locales');

// Define el nombre de tu tabla de locales y la columna de URLs de imágenes
const TABLE_NAME = 'locales'; // <-- ¡IMPORTANTE! Reemplaza con el nombre real de tu tabla
const IMAGE_URLS_COLUMN = 'imagen_urls'; // <-- ¡IMPORTANTE! Reemplaza con el nombre real de tu columna (debe ser TEXT[])
const ID_COLUMN = 'id_local'; // <-- ¡IMPORTANTE! Reemplaza con el nombre real de tu columna ID (ej. 'id', 'local_id', etc.)

/**
 * Función principal para migrar las imágenes.
 */
async function migrateImages() {
    console.log('Iniciando la migración de imágenes para PostgreSQL...');
    let client; // Cliente de PostgreSQL
    let migratedCount = 0; // Contador de imágenes migradas exitosamente
    let failedCount = 0; // Contador de imágenes que fallaron en la migración

    try {
        // Conecta a la base de datos PostgreSQL
        client = await pool.connect();
        console.log('Conectado a PostgreSQL.');

        // Consulta todos los documentos de 'Local' en la base de datos
        // Asegúrate de seleccionar las columnas correctas.
        const res = await client.query(`SELECT ${ID_COLUMN}, nombre_del_negocio, ${IMAGE_URLS_COLUMN} FROM ${TABLE_NAME}`);
        const locals = res.rows; // Obtiene las filas de la consulta

        // Itera sobre cada local encontrado
        for (const local of locals) {
            console.log(`\nProcesando local: ${local.nombre} (ID: ${local[ID_COLUMN]})`);
            const newImageUrls = []; // Array para almacenar las nuevas URLs de Cloudinary
            let localUpdated = false; // Bandera para saber si el local necesita ser actualizado en la DB

            // Verifica si el local tiene URLs de imágenes y si es un array
            if (Array.isArray(local[IMAGE_URLS_COLUMN]) && local[IMAGE_URLS_COLUMN].length > 0) {
                // Itera sobre cada URL de imagen del local
                for (const imageUrl of local[IMAGE_URLS_COLUMN]) {
                    // Comprueba si la URL es una ruta local (ej. empieza con '/uploads/')
                    if (imageUrl && imageUrl.startsWith('/uploads/')) {
                        // Construye la ruta completa del archivo local
                        const localImagePath = path.join(PUBLIC_UPLOADS_DIR, path.basename(imageUrl));
                        console.log(`  - Intentando migrar imagen local: ${localImagePath}`);

                        try {
                            // Lee el archivo de imagen local como un buffer
                            const imageBuffer = await fs.readFile(localImagePath);
                            // Determina la extensión para el mimeType
                            const ext = path.extname(localImagePath).substring(1);
                            const base64Image = `data:image/${ext};base64,${imageBuffer.toString('base64')}`;

                            // Sube la imagen a Cloudinary
                            const result = await cloudinary.uploader.upload(base64Image, {
                                folder: 'locales_images_migrated', // Opcional: especifica una carpeta en Cloudinary para organizar
                                resource_type: 'image' // Asegura que se suba como imagen
                            });

                            // Agrega la nueva URL segura de Cloudinary al array de nuevas URLs
                            newImageUrls.push(result.secure_url);
                            console.log(`    -> Subida exitosa a Cloudinary: ${result.secure_url}`);
                            localUpdated = true; // Marca que este local ha tenido una imagen migrada
                            migratedCount++; // Incrementa el contador de éxito

                        } catch (uploadError) {
                            // Manejo de errores si la subida falla
                            console.error(`    -> Error al migrar la imagen ${localImagePath}:`, uploadError.message);
                            newImageUrls.push(imageUrl); // Si falla, mantiene la URL antigua para no perderla
                            failedCount++; // Incrementa el contador de fallos
                        }
                    } else {
                        // Si la URL no es local (ya es de Cloudinary o externa), la mantiene tal cual
                        newImageUrls.push(imageUrl);
                    }
                }
            } else {
                // Si no hay imagen_urls o no es un array, se mantiene el array vacío o el valor original.
                // Esto es importante para no sobrescribir si la columna no es un array o está vacía.
                newImageUrls.push(...(local[IMAGE_URLS_COLUMN] || []));
            }

            // Si alguna imagen fue migrada para este local, actualiza el documento en la base de datos
            if (localUpdated) {
                // Actualiza el registro en PostgreSQL. Asegúrate que la columna es de tipo TEXT[]
                await client.query(
                    `UPDATE ${TABLE_NAME} SET ${IMAGE_URLS_COLUMN} = $1 WHERE ${ID_COLUMN} = $2`,
                    [newImageUrls, local[ID_COLUMN]]
                );
                console.log(`Local "${local.nombre}" (ID: ${local[ID_COLUMN]}) actualizado con nuevas URLs de Cloudinary.`);
            } else {
                console.log(`Local "${local.nombre}" (ID: ${local[ID_COLUMN]}) no requirió actualización de imágenes (no se encontraron URLs locales o no había imágenes).`);
            }
        }

        console.log('\n--- Resumen de la Migración ---');
        console.log(`Total de locales procesados: ${locals.length}`);
        console.log(`Imágenes migradas exitosamente: ${migratedCount}`);
        console.log(`Imágenes fallidas en la migración: ${failedCount}`);
        console.log('Proceso de migración completado.');

    } catch (error) {
        console.error('Ocurrió un error crítico durante la migración:', error);
    } finally {
        // Asegura que la conexión a PostgreSQL se libere al finalizar
        if (client) {
            client.release();
            console.log('Cliente de PostgreSQL liberado.');
        }
        await pool.end(); // Cierra el pool de conexiones
        console.log('Pool de PostgreSQL cerrado.');
    }
}

// Ejecuta la función de migración
migrateImages();
