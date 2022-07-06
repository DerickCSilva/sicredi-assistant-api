// Módulos
const router = require('express').Router();
const httpStatus = require('http-status');

// Rotas utilizadas
const indexRoutes = require('./modules/index/index.route');
const chatRoutes = require('./modules/chat/chat.route');
const mobileRoutes = require('./modules/mobile/mobile.route');

/** GET /health-check - Verificar saúde do app */
router.get('/health-check', (req, res) => res.status(httpStatus.OK).send('OK'));

// Montagem das rotas respectivas
router.use('/', indexRoutes);

router.use('/', chatRoutes);

router.use('/', mobileRoutes);

module.exports = router;
