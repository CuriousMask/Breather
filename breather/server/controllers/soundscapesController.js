const Soundscape = require('../models/Soundscape');
const { sendSuccess, sendCreated, sendNotFound, sendForbidden } = require('../utils/response');

exports.getSoundscapes = async (req, res, next) => {
  try {
    const soundscapes = await Soundscape.find({ userId: req.user._id }).sort({ createdAt: -1 });
    return sendSuccess(res, { soundscapes });
  } catch (err) { next(err); }
};

exports.saveSoundscape = async (req, res, next) => {
  try {
    const { name, sounds, masterVolume } = req.body;
    const soundscape = await Soundscape.create({ userId: req.user._id, name, sounds, masterVolume });
    return sendCreated(res, { soundscape }, 'Soundscape preset saved');
  } catch (err) { next(err); }
};

exports.updateSoundscape = async (req, res, next) => {
  try {
    const soundscape = await Soundscape.findById(req.params.id);
    if (!soundscape) return sendNotFound(res, 'Soundscape not found');
    if (soundscape.userId.toString() !== req.user._id.toString()) return sendForbidden(res);
    Object.assign(soundscape, req.body);
    await soundscape.save();
    return sendSuccess(res, { soundscape }, 'Soundscape updated');
  } catch (err) { next(err); }
};

exports.deleteSoundscape = async (req, res, next) => {
  try {
    const soundscape = await Soundscape.findById(req.params.id);
    if (!soundscape) return sendNotFound(res, 'Soundscape not found');
    if (soundscape.userId.toString() !== req.user._id.toString()) return sendForbidden(res);
    await soundscape.deleteOne();
    return sendSuccess(res, {}, 'Soundscape deleted');
  } catch (err) { next(err); }
};
