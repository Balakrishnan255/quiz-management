const router = require('express').Router();
const c = require('../controllers/quizController');
const { authenticate, requireAdmin } = require('../middleware/auth');

router.get('/', authenticate, c.list);
router.get('/:id', authenticate, c.get);
router.post('/', authenticate, requireAdmin, c.create);
router.put('/:id', authenticate, requireAdmin, c.update);
router.delete('/:id', authenticate, requireAdmin, c.remove);

module.exports = router;
