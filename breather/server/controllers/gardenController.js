const Garden = require('../models/Garden');
const { sendSuccess, sendCreated, sendNotFound } = require('../utils/response');

exports.getGarden = async (req, res, next) => {
  try {
    const garden = await Garden.findOne({ userId: req.user._id });
    return sendSuccess(res, { garden: garden || null });
  } catch (err) { next(err); }
};

exports.saveGarden = async (req, res, next) => {
  try {
    const { objects, environment, weather, theme, backgroundColor } = req.body;
    const garden = await Garden.create({
      userId: req.user._id,
      objects: objects || [],
      environment, weather, theme, backgroundColor,
    });
    return sendCreated(res, { garden }, 'Garden saved');
  } catch (err) { next(err); }
};

exports.updateGarden = async (req, res, next) => {
  try {
    const garden = await Garden.findOneAndUpdate(
      { userId: req.user._id },
      { ...req.body, updatedAt: Date.now() },
      { new: true, upsert: true, runValidators: true }
    );
    return sendSuccess(res, { garden }, 'Garden updated');
  } catch (err) { next(err); }
};

exports.deleteGardenObject = async (req, res, next) => {
  try {
    const { objectId } = req.body;
    const garden = await Garden.findOneAndUpdate(
      { userId: req.user._id },
      { $pull: { objects: { id: objectId } } },
      { new: true }
    );
    if (!garden) return sendNotFound(res, 'Garden not found');
    return sendSuccess(res, { garden }, 'Object removed');
  } catch (err) { next(err); }
};
