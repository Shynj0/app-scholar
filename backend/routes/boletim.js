const router = require('express').Router();
const auth   = require('../middleware/auth');
const ctrl   = require('../controllers/boletimController');

router.use(auth);

router.get('/:matricula', ctrl.getBoletim);

module.exports = router;
