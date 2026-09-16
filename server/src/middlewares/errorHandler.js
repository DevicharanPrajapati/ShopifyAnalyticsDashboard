/**
 * @file errorHandler.js
 * @description Centralized error handling and 404 middleware for Express, integrated with ApiError.
 */

import { ApiError } from '../utils/apiError.js';

/**
 * Catches unhandled routes and forwards a 404 ApiError to the error handler.
 */
export const notFound = (req, res, next) => {
  const error = new ApiError(404, `Route Not Found - ${req.method} ${req.originalUrl}`);
  next(error);
};

/**
 * Centralized application error handling middleware.
 * Formats custom ApiErrors, Mongoose cast/validation errors, and returns clean JSON responses.
 */
export const errorHandler = (err, req, res, next) => {
  let error = err;

  // If not already an ApiError instance, convert it based on error type
  if (!(error instanceof ApiError)) {
    let statusCode = res.statusCode === 200 ? 500 : res.statusCode;
    let message = error.message || 'Internal Server Error';
    let errors = [];

    // Handle Mongoose Bad ObjectId (CastError)
    if (error.name === 'CastError' && error.kind === 'ObjectId') {
      statusCode = 404;
      message = 'Resource not found: invalid ID format';
    }

    // Handle Mongoose Duplicate Key Error
    if (error.code === 11000) {
      statusCode = 400;
      const field = Object.keys(error.keyValue || {})[0] || 'field';
      message = `Duplicate value for ${field}. Please use a unique value.`;
    }

    // Handle Mongoose Schema Validation Error
    if (error.name === 'ValidationError') {
      statusCode = 400;
      message = 'Validation failed';
      errors = Object.values(error.errors || {}).map((val) => val.message);
    }

    error = new ApiError(statusCode, message, errors, err.stack);
  }

  // Log error in development only
  if (process.env.NODE_ENV === 'development') {
    console.error(`❌ [Error ${error.statusCode}] ${req.method} ${req.originalUrl}:`, error.message);
  }

  res.status(error.statusCode).json({
    statusCode: error.statusCode,
    success: false,
    message: error.message,
    errors: error.errors,
    stack: process.env.NODE_ENV === 'production' ? undefined : error.stack,
  });
};
