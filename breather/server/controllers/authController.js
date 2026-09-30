const jwt = require('jsonwebtoken');
const User = require('../models/User');
const Preference = require('../models/Preference');
const { sendSuccess, sendCreated, sendError, sendUnauthorized } = require('../utils/response');

// Generate JWT
const generateToken = (id) =>
  jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRE || '7d' });

// ── POST /api/auth/register ──
exports.register = async (req, res, next) => {
  try {
    const { name, email, password } = req.body;

    const existing = await User.findOne({ email });
    if (existing) {
      return sendError(res, 'An account with this email already exists.', 409);
    }

    const user = await User.create({ name, email, password });

    // Create default preferences
    await Preference.create({ userId: user._id });

    const token = generateToken(user._id);

    return sendCreated(res, { user, token }, 'Account created successfully');
  } catch (err) {
    next(err);
  }
};

// ── POST /api/auth/login ──
exports.login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email }).select('+password');
    if (!user) {
      return sendUnauthorized(res, 'Invalid email or password.');
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return sendUnauthorized(res, 'Invalid email or password.');
    }

    const token = generateToken(user._id);
    const userData = user.toJSON();

    return sendSuccess(res, { user: userData, token }, 'Logged in successfully');
  } catch (err) {
    next(err);
  }
};

// ── POST /api/auth/logout ──
exports.logout = async (req, res, next) => {
  // JWT is stateless; client drops the token.
  return sendSuccess(res, {}, 'Logged out successfully');
};

// ── GET /api/auth/me ──
exports.getMe = async (req, res, next) => {
  try {
    return sendSuccess(res, { user: req.user });
  } catch (err) {
    next(err);
  }
};
