const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const { getCreations, saveCreation, deleteCreation } = require('../controllers/creationsController');

router.get('/',     protect, getCreations);
router.post('/',    protect, saveCreation);
router.delete('/:id', protect, deleteCreation);

module.exports = router;
