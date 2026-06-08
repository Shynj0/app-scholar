const router = require('express').Router();
const auth = require('../middleware/auth'); // Middleware de autenticação é obrigatório
const ctrl = require('../controllers/professorController'); // Certifique-se de importar o controller correto

// Todas as rotas abaixo exigem que o usuário esteja logado
router.use(auth);

// Rotas do Professor
router.get('/disciplinas', ctrl.getMinhasDisciplinas);
router.get('/alunos',      ctrl.getMeusAlunos);
router.post('/notas',      ctrl.createNota);
router.put('/notas/:id',   ctrl.updateNota);

module.exports = router;