const express = require('express');
const router = express.Router();
const { listBySubject, createPractical, updatePractical, deletePractical } = require('../controllers/practicalController');
const { protect } = require('../middleware/authMiddleware');

router.get('/subject/:id', listBySubject);
router.post('/', protect, createPractical);
router.put('/:id', protect, updatePractical);
router.delete('/:id', protect, deletePractical);

module.exports = router;
