/**
 * @file dateHelper.js
 * @description Date utility functions for analytics range parsing and growth percentage calculations.
 */

/**
 * Returns a new Date object set to 00:00:00.000 for the given date.
 *
 * @param {Date|string|number} date - Input date
 * @returns {Date} Date set to the start of day
 */
export const startOfDay = (date) => {
  const d = new Date(date);
  d.setHours(0, 0, 0, 0);
  return d;
};

/**
 * Returns a new Date object set to 23:59:59.999 for the given date.
 *
 * @param {Date|string|number} date - Input date
 * @returns {Date} Date set to the end of day
 */
export const endOfDay = (date) => {
  const d = new Date(date);
  d.setHours(23, 59, 59, 999);
  return d;
};

/**
 * Parses user date filters (custom dates or presets) into start/end boundaries,
 * and automatically computes the preceding comparison window.
 *
 * Supported presets: 'today', 'yesterday', '7d', '30d', '90d', '1y'
 *
 * @param {string} [startDateStr] - ISO or YYYY-MM-DD custom start date string
 * @param {string} [endDateStr] - ISO or YYYY-MM-DD custom end date string
 * @param {string} [preset='30d'] - Preset filter identifier
 * @returns {{ start: Date, end: Date, prevStart: Date, prevEnd: Date }} Calculated boundaries
 */
export const parseDateRange = (startDateStr, endDateStr, preset = '30d') => {
  const now = new Date();
  let start;
  let end = endOfDay(now);

  // Custom explicit date range provided
  if (startDateStr && endDateStr) {
    start = startOfDay(startDateStr);
    end = endOfDay(endDateStr);
  } else {
    // Preset calculation
    switch (preset) {
      case 'today':
        start = startOfDay(now);
        break;

      case 'yesterday': {
        const y = new Date(now);
        y.setDate(y.getDate() - 1);
        start = startOfDay(y);
        end = endOfDay(y);
        break;
      }

      case '7d': {
        const d = new Date(now);
        d.setDate(d.getDate() - 6);
        start = startOfDay(d);
        break;
      }

      case '90d': {
        const d = new Date(now);
        d.setDate(d.getDate() - 89);
        start = startOfDay(d);
        break;
      }

      case '1y': {
        const d = new Date(now);
        d.setFullYear(d.getFullYear() - 1);
        start = startOfDay(d);
        break;
      }

      case '30d':
      default: {
        const d = new Date(now);
        d.setDate(d.getDate() - 29);
        start = startOfDay(d);
        break;
      }
    }
  }

  // Calculate matching previous period for comparative metrics (e.g., % change)
  const durationMs = end.getTime() - start.getTime();
  const prevEnd = new Date(start.getTime() - 1);
  const prevStart = new Date(prevEnd.getTime() - durationMs);

  return {
    start,
    end,
    prevStart,
    prevEnd,
  };
};

/**
 * Convenient helper to extract and parse date ranges directly from an Express req.query object.
 *
 * @param {object} query - Express req.query
 * @returns {{ start: Date, end: Date, prevStart: Date, prevEnd: Date }}
 */
export const getDateRangeFromQuery = (query = {}) => {
  const { startDate, endDate, preset } = query;
  return parseDateRange(startDate, endDate, preset);
};

/**
 * Computes the percentage change between current and previous values.
 *
 * @param {number} current - Current period metric
 * @param {number} previous - Previous period metric
 * @returns {number} Percentage change rounded to 2 decimal places
 */
export const calculatePercentageChange = (current, previous) => {
  if (!previous || previous === 0) {
    return current > 0 ? 100 : 0;
  }
  const change = ((current - previous) / previous) * 100;
  return Number(change.toFixed(2));
};
