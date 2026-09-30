const Preference = require('../models/Preference');
const { sendSuccess } = require('../utils/response');

exports.getPreferences = async (req, res, next) => {
  try {
    let prefs = await Preference.findOne({ userId: req.user._id });
    if (!prefs) prefs = await Preference.create({ userId: req.user._id });
    return sendSuccess(res, { preferences: prefs });
  } catch (err) { next(err); }
};

exports.savePreferences = async (req, res, next) => {
  try {
    const prefs = await Preference.findOneAndUpdate(
      { userId: req.user._id },
      { ...req.body },
      { new: true, upsert: true, runValidators: true }
    );
    return sendSuccess(res, { preferences: prefs }, 'Preferences saved');
  } catch (err) { next(err); }
};
