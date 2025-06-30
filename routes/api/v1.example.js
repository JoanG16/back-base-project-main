const { Router } = require('express');

const { ExampleValidator } = require('../../utils/validators');

module.exports = function ({ ExampleController, JoiValidatorMiddleware }) {
  const router = Router();

  //Developed by me
  router.get('/hello', ExampleController.hello);

  router.post(
    '/create-with-validator',
    JoiValidatorMiddleware(ExampleValidator.create),
    ExampleController.createWithValidator
  );

  //Bases
  router.get('/get-all', ExampleController.getAll);
  router.get('/get-one/:id', ExampleController.getOne);
  router.post('/create', ExampleController.create);
  router.put('/update/:id', ExampleController.update);
  router.delete('/delete/:id', ExampleController.delete);
  return router;
};
