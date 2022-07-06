// Módulos
const router = require('express').Router();

// Controller
const Controller = require('./assistant.controller');

// Rotas
router.post('/api/message', Controller.processMessage);

// Para processar mensagens do bot Suporte
router.post('/mobile/api/message', Controller.processMessage);

module.exports = router;
