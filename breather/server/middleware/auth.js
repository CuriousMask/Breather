const jwt = require('jsonwebtoken');
const User = require('../models/User');
const { sendUnauthorized } = require('../utils/response');

const protect = async (req, res, next) => {
  let token;

  // Check Authorization header
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer ')) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (!token) {
    return sendUnauthorized(res, 'Access denied. No token provided.');
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = await User.findById(decoded.id).select('-password');

    if (!req.user) {
      return sendUnauthorized(res, 'User no longer exists.');
    }

    next();
  } catch (error) {
    return sendUnauthorized(res, 'Invalid or expired token.');
  }
};

module.exports = { protect };
