const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const { getPreferences, savePreferences } = require('../controllers/preferencesController');

router.get('/',  protect, getPreferences);
router.post('/', protect, savePreferences);

module.exports = router;
