// backend/services/contenedor.service.js
const catchServiceAsync = require('../utils/catch-service-async');
const BaseService = require('./base.service');
const SocioModel = require('../models/socio.models'); // Asegúrate de que esta ruta sea correcta y que SocioModel esté definido

let _contenedor = null;

module.exports = class ContenedorService extends BaseService {
  constructor({ ContenedorModel }) {
    super(ContenedorModel);
    _contenedor = ContenedorModel;
  }

  getAllContenedores = catchServiceAsync(async () => {
    const results = await this.model.findAll({
      // Incluir la información del socio asociado
      include: {
        model: SocioModel, // Asegúrate de que SocioModel esté correctamente asociado en ContenedorModel
        as: 'socio', // Usar el alias definido en la relación (ej. ContenedorModel.belongsTo(SocioModel, { as: 'socio' }))
        attributes: ['id_socio', 'nombres', 'apellido'], // Campos que quieres del socio
      },
      order: [['id_contenedor', 'ASC']] // Opcional: ordenar para consistencia
    });
    return results; // Esto será envuelto en { data: results } por el controlador
  });

  getUniqueBloques = catchServiceAsync(async () => {
    const results = await _contenedor.findAll({
      attributes: ['bloque'],
      group: ['bloque'],
      order: [['bloque', 'ASC']]
    });
    return results.map(item => item.bloque).filter(bloque => bloque !== null);
  });

  getContenedoresWithGeojson = catchServiceAsync(async () => {
    const [results] = await _contenedor.sequelize.query(`
      SELECT
        id_contenedor AS id,
        numero_contenedor AS nombre,
        ST_AsGeoJSON(geom) AS geojson
      FROM contenedores;
    `);

    const data = results.map(row => {
      return {
        id: row.id,
        nombre: row.nombre,
        geom: JSON.parse(row.geojson), // Asegúrate de que esto siempre sea un GeoJSON válido
      };
    });

    return { data };
  });

  getOneContenedor = catchServiceAsync(async (id) => {
    const result = await _contenedor.findByPk(id, {
      include: {
        model: SocioModel,
        as: 'socio',
        attributes: ['id_socio', 'nombres', 'apellido'],
      }
    });
    if (!result) {
      throw new Error(`Contenedor con ID ${id} no encontrado`);
    }
    return { data: result };
  });

  createContenedor = catchServiceAsync(async (body) => {
    const { numero_contenedor, bloque, geom, socioId } = body;

    if (!numero_contenedor || !bloque || !Array.isArray(geom) || geom.length < 3 || !Array.isArray(geom[0]) || socioId === undefined || socioId === null) {
      throw new Error('Datos inválidos: número de contenedor, bloque, socio y coordenadas son obligatorios.');
    }

    // Asegura que el polígono esté cerrado para PostGIS
    let closedGeom = [...geom]; // Crea una copia para no modificar el array original
    if (closedGeom.length > 0 && (closedGeom[0][0] !== closedGeom[closedGeom.length - 1][0] || closedGeom[0][1] !== closedGeom[closedGeom.length - 1][1])) {
      closedGeom.push(closedGeom[0]);
    }

    // Verifica si ya existe ese número de contenedor
    const [exists] = await _contenedor.sequelize.query(
      `SELECT 1 FROM contenedores WHERE numero_contenedor = :numero_contenedor LIMIT 1`,
      {
        replacements: { numero_contenedor },
        type: _contenedor.sequelize.QueryTypes.SELECT,
      }
    );

    if (exists && exists.length > 0) {
      throw new Error('Ya existe un contenedor con ese número.');
    }

    const coordinatesText = closedGeom.map(([x, y]) => `${x} ${y}`).join(', ');
    const polygonWKT = `POLYGON((${coordinatesText}))`;

    const [result] = await _contenedor.sequelize.query(
      `
      INSERT INTO contenedores (numero_contenedor, bloque, geom, "socioId", creado_en)
      VALUES (:numero_contenedor, :bloque, ST_GeomFromText(:polygon, 0), :socioId, NOW())
      RETURNING *;
      `,
      {
        replacements: {
          numero_contenedor,
          bloque,
          polygon: polygonWKT,
          socioId
        },
        type: _contenedor.sequelize.QueryTypes.INSERT
      }
    );

    return {
      statusCode: 201,
      status: 'Success',
      message: 'Contenedor creado correctamente',
      data: result[0]
    };
  });

  updateContenedor = catchServiceAsync(async (id, body) => {
    const contenedor = await _contenedor.findByPk(id);
    if (!contenedor) {
      throw new Error(`Contenedor con ID ${id} no encontrado`);
    }

    const { numero_contenedor, bloque, geom, socioId } = body;
    let updateFields = {};

    if (numero_contenedor !== undefined) updateFields.numero_contenedor = numero_contenedor;
    if (bloque !== undefined) updateFields.bloque = bloque;
    if (socioId !== undefined) updateFields.socioId = socioId; // Incluir socioId en la actualización

    // Si geom está presente, convertir a WKT
    if (geom && Array.isArray(geom) && geom.length > 0) {
      let closedGeom = [...geom];
      if (closedGeom.length > 0 && (closedGeom[0][0] !== closedGeom[closedGeom.length - 1][0] || closedGeom[0][1] !== closedGeom[closedGeom.length - 1][1])) {
        closedGeom.push(closedGeom[0]);
      }
      const coordinatesText = closedGeom.map(([x, y]) => `${x} ${y}`).join(', ');
      const polygonWKT = `POLYGON((${coordinatesText}))`;
      // Usar sequelize.literal para funciones PostGIS
      updateFields.geom = _contenedor.sequelize.literal(`ST_GeomFromText('${polygonWKT}', 0)`);
    }

    await contenedor.update(updateFields); // Actualizar solo los campos proporcionados

    // Re-obtener el contenedor con los datos actualizados y el socio incluido para la respuesta
    const updatedContenedor = await _contenedor.findByPk(id, {
      include: {
        model: SocioModel,
        as: 'socio',
        attributes: ['id_socio', 'nombres', 'apellido'],
      }
    });

    return { data: updatedContenedor };
  });

  deleteContenedor = catchServiceAsync(async (id) => {
    const contenedor = await _contenedor.findByPk(id);
    if (!contenedor) {
      throw new Error(`Contenedor con ID ${id} no encontrado`);
    }
    await contenedor.destroy();
    return { data: contenedor }; // Podrías devolver un mensaje de éxito en lugar del objeto eliminado
  });
};