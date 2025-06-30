const { Router } = require('express');

module.exports = function ({ ContenedorController }) {
  const router = Router();

  router.get('/get-all', ContenedorController.getAllContenedores);
  router.get('/get-one/:id', ContenedorController.getOneContenedor);
  router.get('/geo', ContenedorController.getContenedoresGeo);
  router.post('/create', ContenedorController.createContenedor);
  router.put('/update/:id', ContenedorController.updateContenedor);
  router.delete('/delete/:id', ContenedorController.deleteContenedor);
  router.get('/bloques-unicos', ContenedorController.getUniqueBloques);

  return router;
};
