const router = require('express').Router();
const c = require('../controllers/userController');
const { authenticate, requireAdmin } = require('../middleware/auth');

router.get('/', authenticate, requireAdmin, c.list);
router.get('/stats', authenticate, requireAdmin, c.stats);

module.exports = router;
