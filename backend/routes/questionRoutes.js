const router = require('express').Router();
const c = require('../controllers/questionController');
const { authenticate, requireAdmin } = require('../middleware/auth');

router.get('/quiz/:quizId', authenticate, c.byQuiz);
router.post('/', authenticate, requireAdmin, c.create);
router.put('/:id', authenticate, requireAdmin, c.update);
router.delete('/:id', authenticate, requireAdmin, c.remove);

module.exports = router;
