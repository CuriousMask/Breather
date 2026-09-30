const Room = require('../models/Room');
const { sendSuccess, sendCreated } = require('../utils/response');

exports.getRoom = async (req, res, next) => {
  try {
    const room = await Room.findOne({ userId: req.user._id });
    return sendSuccess(res, { room: room || null });
  } catch (err) { next(err); }
};

exports.saveRoom = async (req, res, next) => {
  try {
    const room = await Room.create({ userId: req.user._id, ...req.body });
    return sendCreated(res, { room }, 'Room saved');
  } catch (err) { next(err); }
};

exports.updateRoom = async (req, res, next) => {
  try {
    const room = await Room.findOneAndUpdate(
      { userId: req.user._id },
      { ...req.body },
      { new: true, upsert: true, runValidators: true }
    );
    return sendSuccess(res, { room }, 'Room updated');
  } catch (err) { next(err); }
};
