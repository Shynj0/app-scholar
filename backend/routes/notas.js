const express = require('express');
const router = express.Router();
const ctrl = require('../controllers/notasController');
const { autenticar } = require('../middleware/auth');

router.get('/', autenticar, ctrl.listar);
router.get('/aluno/:aluno_id', autenticar, ctrl.buscarPorAluno);
router.post('/', autenticar, ctrl.criar);
router.put('/:id', autenticar, ctrl.atualizar);

module.exports = router;
