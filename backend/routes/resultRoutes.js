const router = require('express').Router();
const c = require('../controllers/resultController');
const { authenticate, requireAdmin } = require('../middleware/auth');

router.post('/submit', authenticate, c.submit);
router.get('/my', authenticate, c.myHistory);
router.get('/attempt/:id', authenticate, c.attemptDetail);
router.get('/all', authenticate, requireAdmin, c.all);

module.exports = router;
