// Módulos
const router = require('express').Router();

// Controller
const Controller = require('./chat.controller');

// Rotas
router.get('/chat', Controller.chat);

module.exports = router;
