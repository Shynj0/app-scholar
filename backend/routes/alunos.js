const express = require('express');
const router = express.Router();
const ctrl = require('../controllers/alunosController');
const { autenticar } = require('../middleware/auth');

router.get('/', autenticar, ctrl.listar);
router.get('/cep/:cep', ctrl.buscarCep);                      // público — ViaCEP
router.get('/matricula/:matricula', autenticar, ctrl.buscarPorMatricula);
router.get('/:id', autenticar, ctrl.buscarPorId);
router.post('/', autenticar, ctrl.criar);
router.put('/:id', autenticar, ctrl.atualizar);
router.delete('/:id', autenticar, ctrl.remover);

module.exports = router;
