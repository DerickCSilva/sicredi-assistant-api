// Módulos
const router = require('express').Router();

// Controller
const Controller = require('./index.controller');

// Rotas
router.get('/', Controller.index);

module.exports = router;
