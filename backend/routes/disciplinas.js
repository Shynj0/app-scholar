const router = require('express').Router();
const auth   = require('../middleware/auth');
const ctrl   = require('../controllers/disciplinasController');

router.use(auth);

router.get('/',     ctrl.getAll);
router.get('/:id',  ctrl.getById);
router.post('/',    ctrl.create);
router.put('/:id',  ctrl.update);
router.delete('/:id', ctrl.remove);

module.exports = router;
