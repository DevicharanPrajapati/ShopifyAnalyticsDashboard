/**
 * @file orderController.js
 * @description Controller for querying, filtering, and paginating store orders.
 */

import mongoose from 'mongoose';
import Order from '../models/Order.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { ApiResponse } from '../utils/apiResponse.js';
import { ApiError } from '../utils/apiError.js';

/**
 * @route   GET /api/orders
 * @desc    Fetch paginated orders list with optional status filtering and customer/order search
 */
export const getOrders = asyncHandler(async (req, res) => {
  const { status, search, page = 1, limit = 20 } = req.query;

  const pageNum = Math.max(1, parseInt(page, 10) || 1);
  const limitNum = Math.min(100, Math.max(1, parseInt(limit, 10) || 20));
  const skip = (pageNum - 1) * limitNum;

  const filter = {};

  if (status) {
    filter.financialStatus = status;
  }

  if (search && search.trim()) {
    const searchRegex = { $regex: search.trim(), $options: 'i' };
    filter.$or = [
      { orderNumber: searchRegex },
      { 'customer.name': searchRegex },
      { 'customer.email': searchRegex },
    ];
  }

  const [orders, total] = await Promise.all([
    Order.find(filter)
      .skip(skip)
      .limit(limitNum)
      .sort({ orderDate: -1 })
      .lean(),
    Order.countDocuments(filter),
  ]);

  return new ApiResponse(
    200,
    {
      orders,
      pagination: {
        total,
        page: pageNum,
        pages: Math.ceil(total / limitNum) || 1,
        limit: limitNum,
      },
    },
    'Orders retrieved successfully'
  ).send(res);
});

/**
 * @route   GET /api/orders/:id
 * @desc    Fetch single order by MongoDB ID
 */
export const getOrderById = asyncHandler(async (req, res) => {
  const { id } = req.params;

  if (!mongoose.isValidObjectId(id)) {
    throw new ApiError(404, 'Order not found: invalid ID format');
  }

  const order = await Order.findById(id).lean();

  if (!order) {
    throw new ApiError(404, 'Order not found');
  }

  return new ApiResponse(200, order, 'Order retrieved successfully').send(res);
});
