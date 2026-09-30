const Creation = require('../models/Creation');
const { sendSuccess, sendCreated, sendNotFound, sendForbidden } = require('../utils/response');

exports.getCreations = async (req, res, next) => {
  try {
    const creations = await Creation.find({ userId: req.user._id })
      .sort({ createdAt: -1 })
      .select('-canvasData'); // exclude heavy field from list
    return sendSuccess(res, { creations });
  } catch (err) { next(err); }
};

exports.saveCreation = async (req, res, next) => {
  try {
    const { title, canvasData, prompt, thumbnail, dimensions, tags } = req.body;
    const creation = await Creation.create({
      userId: req.user._id,
      title, canvasData, prompt, thumbnail, dimensions, tags,
    });
    return sendCreated(res, { creation }, 'Drawing saved');
  } catch (err) { next(err); }
};

exports.deleteCreation = async (req, res, next) => {
  try {
    const creation = await Creation.findById(req.params.id);
    if (!creation) return sendNotFound(res, 'Creation not found');
    if (creation.userId.toString() !== req.user._id.toString()) {
      return sendForbidden(res, 'Not authorized');
    }
    await creation.deleteOne();
    return sendSuccess(res, {}, 'Creation deleted');
  } catch (err) { next(err); }
};
