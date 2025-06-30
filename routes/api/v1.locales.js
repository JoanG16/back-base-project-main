const { Router } = require('express');

module.exports = function ({ LocalController }) {
  const router = Router();

  router.get('/', LocalController.getAllLocales); // preferido
  router.get('/get-all', LocalController.getAllLocales)

  router.get('/get-one/:id', LocalController.getOneLocal);
  router.post('/create', LocalController.createLocal);
  router.put('/update/:id', LocalController.updateLocal);
  router.delete('/delete/:id', LocalController.deleteLocal);
  router.post('/:id/productos', LocalController.createProductoForLocal); // Si este endpoint es funcional

  return router;
};