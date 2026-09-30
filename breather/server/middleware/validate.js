const { validationResult } = require('express-validator');
const { sendValidationError } = require('../utils/response');

/**
 * Middleware to catch express-validator errors and return a standardized response.
 */
const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const formatted = errors.array().map((e) => ({
      field: e.path,
      message: e.msg,
    }));
    return sendValidationError(res, formatted);
  }
  next();
};

module.exports = validate;
