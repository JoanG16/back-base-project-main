const { Router } = require('express');
// const { SocioValidator } = require('../../utils/validators');

module.exports = function ({ SocioController  }) {
  const router = Router();

  router.get('/get-all', SocioController.getAllSocios);
  router.get('/get-one/:id', SocioController.getOneSocio);
  router.post('/create', SocioController.createSocio);
  router.put('/update/:id', SocioController.updateSocio);
  router.delete('/delete/:id', SocioController.deleteSocio);

  return router;
};
