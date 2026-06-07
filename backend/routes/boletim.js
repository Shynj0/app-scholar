const express = require('express');
const router = express.Router();
const { buscarBoletim } = require('../controllers/boletimController');
const { autenticar } = require('../middleware/auth');

router.get('/:matricula', autenticar, buscarBoletim);

module.exports = router;
