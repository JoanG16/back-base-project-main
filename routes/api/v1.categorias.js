const { Router } = require('express');

module.exports = function ({ CategoriaController }) {
  const router = Router();

  router.get('/get-all', CategoriaController.getAllCategorias);
  router.get('/get-one/:id', CategoriaController.getOneCategoria);
  router.post('/create', CategoriaController.createCategoria);
  router.put('/update/:id', CategoriaController.updateCategoria);
  router.delete('/delete/:id', CategoriaController.deleteCategoria);

  return router;
};
