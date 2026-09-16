/**
 * @file apiError.js
 * @description Standardized API Error class for custom operational and validation errors.
 */

export class ApiError extends Error {
  /**
   * @param {number} statusCode - HTTP status code (e.g. 400, 401, 403, 404, 500)
   * @param {string} [message='Something went wrong'] - Error explanation message
   * @param {Array|string} [errors=[]] - Detailed validation or field error array
   * @param {string} [stack=''] - Optional stack trace override
   */
  constructor(
    statusCode = 500,
    message = 'Something went wrong',
    errors = [],
    stack = ''
  ) {
    super(message);
    this.statusCode = statusCode;
    this.data = null;
    this.message = message;
    this.success = false;
    this.errors = Array.isArray(errors) ? errors : [errors];

    if (stack) {
      this.stack = stack;
    } else {
      Error.captureStackTrace(this, this.constructor);
    }
  }
}

/**
 * Functional factory utility to create an ApiError instance.
 *
 * @param {number} statusCode
 * @param {string} message
 * @param {Array|string} [errors=[]]
 * @returns {ApiError}
 *
 * @example
 * throw apiError(404, "Product not found");
 */
export const apiError = (statusCode, message, errors = []) => {
  return new ApiError(statusCode, message, errors);
};

export default ApiError;
