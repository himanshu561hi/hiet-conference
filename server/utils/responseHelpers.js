/**
 * Centralized Response Handlers
 */

exports.sendSuccess = (res, statusCode, message, data = null, req = {}) => {
  return res.status(statusCode).json({
    success: true,
    message,
    data,
    errors: null,
    timestamp: new Date().toISOString(),
    requestId: req.id || 'unknown'
  });
};

exports.sendError = (res, statusCode, code, message, errors = null, req = {}) => {
  return res.status(statusCode).json({
    success: false,
    code,
    message,
    data: {},
    errors,
    timestamp: new Date().toISOString(),
    requestId: req.id || 'unknown'
  });
};

exports.formatZodError = (zodError) => {
  return zodError.errors.map(e => ({
    field: e.path.join('.'),
    message: e.message
  }));
};
