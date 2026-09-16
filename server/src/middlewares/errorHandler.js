/**
 * @file errorHandler.js
 * @description Centralized error handling and 404 middleware for Express.
 */

/**
 * Catches unhandled routes and forwards a 404 error to the error handler.
 */
export const notFound = (req, res, next) => {
  const error = new Error(`Route Not Found - ${req.method} ${req.originalUrl}`);
  res.status(404);
  next(error);
};

/**
 * Centralized application error handling middleware.
 * Formats Mongoose cast/validation errors and returns clean JSON responses.
 */
export const errorHandler = (err, req, res, next) => {
  let statusCode = res.statusCode === 200 ? 500 : res.statusCode;
  let message = err.message || 'Internal Server Error';

  // Handle Mongoose Bad ObjectId (CastError)
  if (err.name === 'CastError' && err.kind === 'ObjectId') {
    statusCode = 404;
    message = 'Resource not found: invalid ID format';
  }

  // Handle Mongoose Duplicate Key Error
  if (err.code === 11000) {
    statusCode = 400;
    const field = Object.keys(err.keyValue || {})[0] || 'field';
    message = `Duplicate value for ${field}. Please use a unique value.`;
  }

  // Handle Mongoose Schema Validation Error
  if (err.name === 'ValidationError') {
    statusCode = 400;
    message = Object.values(err.errors)
      .map((val) => val.message)
      .join(', ');
  }

  // Log error in development/test
  if (process.env.NODE_ENV !== 'test') {
    console.error(`❌ [Error ${statusCode}] ${req.method} ${req.originalUrl}:`, message);
  }

  res.status(statusCode).json({
    success: false,
    message,
    stack: process.env.NODE_ENV === 'production' ? undefined : err.stack,
  });
};
