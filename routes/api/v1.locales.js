// routes/api/v1.locales.js
const { Router } = require('express');

module.exports = function ({ LocalController }) {
  const router = Router();

  // Ahora esta ruta solo devuelve los locales activos
  router.get('/', LocalController.getAllLocales);
  router.get('/get-all', LocalController.getAllLocales);

  router.get('/reporte/excel', LocalController.downloadLocalesExcel);

  // --- CAMBIO: La ruta de "borrar" ahora desactiva ---
  router.delete('/delete/:id', LocalController.deleteLocal);

  // --- NUEVAS RUTAS para la funcionalidad de activar/desactivar ---
  router.put('/deactivate/:id', LocalController.deleteLocal); // Usar `deleteLocal` ya que tiene la lógica
  router.put('/activate/:id', LocalController.activateLocal);

  router.get('/get-one/:id', LocalController.getOneLocal);
  router.post('/create', LocalController.createLocal);
  router.put('/update/:id', LocalController.updateLocal);
  router.post('/:id/productos', LocalController.createProductoForLocal);

  return router;
};
