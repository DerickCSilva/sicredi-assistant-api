// Módulos
const router = require('express').Router();

// Controller
const Controller = require('./mobile.controller');

// Rotas
router.get('/mobile', Controller.mobile);

module.exports = router;
