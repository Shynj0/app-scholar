const router = require('express').Router();
const auth   = require('../middleware/auth');
const ctrl   = require('../controllers/alunosController');

router.use(auth); // todas protegidas

router.get('/',                      ctrl.getAll);
router.get('/matricula/:matricula',  ctrl.getByMatricula);
router.get('/:id',                   ctrl.getById);
router.post('/',                     ctrl.create);
router.put('/:id',                   ctrl.update);
router.delete('/:id',                ctrl.remove);

module.exports = router;