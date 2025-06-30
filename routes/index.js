const { Router } = require('express');

module.exports = function ({
  DownloadSocios,
  DownloadContenedor,
  DownloadLocales,
  DownloadProductos,
  DownloadCategorias,
  DownloadOfertas
}) {
  const router = Router();
  const apiRouter = Router();

  apiRouter
    .use(require('cors')())
    .use(require('morgan')('dev'))
    .use(require('express').json())
    .use(require('express').urlencoded({ extended: true }));

  apiRouter.use('/socios', DownloadSocios);
  apiRouter.use('/contenedores', DownloadContenedor);
  apiRouter.use('/locales', DownloadLocales);
  apiRouter.use('/productos', DownloadProductos);
  apiRouter.use('/categorias', DownloadCategorias);
  apiRouter.use('/ofertas', DownloadOfertas);
  router.use('/v1/api', apiRouter);

  router.get('/', (req, res) => {
    res.send('v.0.1.0.3');
  });

  return router;
};
