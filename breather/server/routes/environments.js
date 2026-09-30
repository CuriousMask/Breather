const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const { getEnvironments } = require('../controllers/environmentsController');

router.get('/', protect, getEnvironments);

module.exports = router;
