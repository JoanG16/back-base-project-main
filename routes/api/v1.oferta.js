const { Router } = require('express');

module.exports = function ({ OfertaController }) {
  const router = Router();

  // Rutas CRUD para ofertas
  router.get('/get-all', OfertaController.getAllOfertas);
  router.get('/get-one/:id', OfertaController.getOneOferta);
  router.post('/create', OfertaController.createOferta);
  router.put('/update/:id', OfertaController.updateOferta);
  router.delete('/delete/:id', OfertaController.deleteOferta);

  return router;
};
