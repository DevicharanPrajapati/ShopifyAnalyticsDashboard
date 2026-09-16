/**
 * Higher-Order Function to wrap async Express route handlers.
 * Eliminates repetitive try-catch blocks by forwarding rejected promises to next().
 *
 * @param {Function} fn - Async route handler function (req, res, next)
 * @returns {Function} Express middleware handler
 *
 * @example
 * router.get('/items', asyncHandler(async (req, res) => {
 *   const items = await Item.find();
 *   res.json({ success: true, data: items });
 * }));
 */
export const asyncHandler = (fn) => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};

export default asyncHandler;
