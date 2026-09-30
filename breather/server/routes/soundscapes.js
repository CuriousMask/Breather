const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const {
  getSoundscapes,
  saveSoundscape,
  updateSoundscape,
  deleteSoundscape,
} = require('../controllers/soundscapesController');

router.get('/',     protect, getSoundscapes);
router.post('/',    protect, saveSoundscape);
router.put('/:id',  protect, updateSoundscape);
router.delete('/:id', protect, deleteSoundscape);

module.exports = router;
