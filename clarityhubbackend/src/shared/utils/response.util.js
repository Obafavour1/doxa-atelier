/**
 * @desc Standard response format for the application
 */
export const sendResponse = (res, { statusCode = 200, success = true, message, data, error }) => {
  return res.status(statusCode).json({
    success,
    message,
    data,
    ...(error && { error: { code: error.code || "INTERNAL_ERROR", details: error.details } }),
  });
};

/**
 * @desc Helper for success responses
 */
export const successResponse = (res, message, data = null, statusCode = 200) => {
  return sendResponse(res, { statusCode, success: true, message, data });
};

/**
 * @desc Helper for error responses
 */
export const errorResponse = (res, message, code = "ERROR", details = null, statusCode = 400) => {
  return sendResponse(res, { statusCode, success: false, message, error: { code, details } });
};
