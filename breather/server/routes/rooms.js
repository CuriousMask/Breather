const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const { getRoom, saveRoom, updateRoom } = require('../controllers/roomsController');

router.get('/',  protect, getRoom);
router.post('/', protect, saveRoom);
router.put('/',  protect, updateRoom);

module.exports = router;
