/**
 * @file apiResponse.js
 * @description Standardized API response class and helper function for Express controllers.
 */

export class ApiResponse {
  /**
   * @param {number} statusCode - HTTP status code (e.g. 200, 201)
   * @param {*} data - Payload data to return
   * @param {string} [message='Success'] - Descriptive success message
   */
  constructor(statusCode = 200, data = null, message = 'Success') {
    this.statusCode = statusCode;
    this.data = data;
    this.message = message;
    this.success = statusCode < 400;
  }

  /**
   * Helper method to send this ApiResponse directly via the Express res object.
   *
   * @param {import('express').Response} res
   * @returns {import('express').Response}
   *
   * @example
   * new ApiResponse(200, user, "User profile fetched").send(res);
   */
  send(res) {
    return res.status(this.statusCode).json(this);
  }
}

/**
 * Functional utility to instantiate and send an ApiResponse in one step.
 *
 * @param {import('express').Response} res
 * @param {number} [statusCode=200]
 * @param {*} [data=null]
 * @param {string} [message='Success']
 * @returns {import('express').Response}
 *
 * @example
 * apiResponse(res, 200, products, "Products list retrieved");
 */
export const apiResponse = (res, statusCode = 200, data = null, message = 'Success') => {
  return new ApiResponse(statusCode, data, message).send(res);
};

export default ApiResponse;
