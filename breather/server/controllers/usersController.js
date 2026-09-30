const User = require('../models/User');
const { sendSuccess } = require('../utils/response');

exports.getProfile = async (req, res, next) => {
  try {
    return sendSuccess(res, { user: req.user });
  } catch (err) { next(err); }
};

exports.updateProfile = async (req, res, next) => {
  try {
    const allowed = ['name', 'bio', 'avatar', 'favoriteModules'];
    const updates = {};
    allowed.forEach((field) => {
      if (req.body[field] !== undefined) updates[field] = req.body[field];
    });

    const user = await User.findByIdAndUpdate(req.user._id, updates, {
      new: true,
      runValidators: true,
    });

    return sendSuccess(res, { user }, 'Profile updated');
  } catch (err) { next(err); }
};
