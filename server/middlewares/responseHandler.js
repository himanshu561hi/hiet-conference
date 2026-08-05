/**
 * Standardized API Response Helper
 */
const sendResponse = (res, statusCode, message, data = {}, errors = null) => {
  return res.status(statusCode).json({
    success: statusCode >= 200 && statusCode < 300,
    message,
    data,
    errors,
    timestamp: new Date().toISOString(),
    requestId: res.req ? res.req.id : null,
  });
};

module.exports = sendResponse;
