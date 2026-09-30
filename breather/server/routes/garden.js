const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const {
  getGarden,
  saveGarden,
  updateGarden,
  deleteGardenObject,
} = require('../controllers/gardenController');

router.get('/',          protect, getGarden);
router.post('/',         protect, saveGarden);
router.put('/',          protect, updateGarden);
router.delete('/object', protect, deleteGardenObject);

module.exports = router;
