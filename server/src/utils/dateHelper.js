/**
 * Helper to parse date filters and presets
 * Supports: 'today', 'yesterday', '7d', '30d', '90d', '1y', 'custom'
 */
export const parseDateRange = (startDateStr, endDateStr, preset = '30d') => {
  const now = new Date();
  let start;
  let end = new Date(now);
  end.setHours(23, 59, 59, 999);

  if (startDateStr && endDateStr) {
    start = new Date(startDateStr);
    start.setHours(0, 0, 0, 0);

    end = new Date(endDateStr);
    end.setHours(23, 59, 59, 999);
  } else {
    switch (preset) {
      case 'today':
        start = new Date(now);
        start.setHours(0, 0, 0, 0);
        break;
      case 'yesterday': {
        start = new Date(now);
        start.setDate(now.getDate() - 1);
        start.setHours(0, 0, 0, 0);

        end = new Date(now);
        end.setDate(now.getDate() - 1);
        end.setHours(23, 59, 59, 999);
        break;
      }
      case '7d':
        start = new Date(now);
        start.setDate(now.getDate() - 6);
        start.setHours(0, 0, 0, 0);
        break;
      case '90d':
        start = new Date(now);
        start.setDate(now.getDate() - 89);
        start.setHours(0, 0, 0, 0);
        break;
      case '1y':
        start = new Date(now);
        start.setFullYear(now.getFullYear() - 1);
        start.setHours(0, 0, 0, 0);
        break;
      case '30d':
      default:
        start = new Date(now);
        start.setDate(now.getDate() - 29);
        start.setHours(0, 0, 0, 0);
        break;
    }
  }

  // Calculate matching previous period for comparison (e.g. % growth)
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
 * Calculates percentage change between current and previous values
 */
export const calculatePercentageChange = (current, previous) => {
  if (!previous || previous === 0) {
    return current > 0 ? 100 : 0;
  }
  const change = ((current - previous) / previous) * 100;
  return Number(change.toFixed(2));
};
