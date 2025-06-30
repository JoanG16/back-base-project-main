
const { Router } = require('express');

module.exports = function ({ ProductoController }) {
  const router = Router();

  router.get('/get-all', ProductoController.getAllProductos);
  router.get('/get-one/:id', ProductoController.getOneProducto);
  router.post('/create', ProductoController.createProducto);
  router.put('/update/:id', ProductoController.updateProducto);
  router.delete('/delete/:id', ProductoController.deleteProducto);

  return router;
};
