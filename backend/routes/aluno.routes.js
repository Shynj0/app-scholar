const router = require('express').Router();
const auth = require('../middleware/auth'); // Essencial para proteger e identificar o aluno
const ctrl = require('../controllers/alunoController');

// Protege todas as rotas abaixo. 
// Sem o 'auth', o req.user.reference_id não existiria no controller!
router.use(auth);

router.get('/disciplinas', ctrl.getMinhasDisciplinas);
router.get('/boletim',     ctrl.getMeuBoletim);

module.exports = router;