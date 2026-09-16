/**
 * @file productController.js
 * @description Controller for querying, searching, and managing store products and catalog inventory.
 */

import mongoose from 'mongoose';
import Product from '../models/Product.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { ApiResponse } from '../utils/apiResponse.js';
import { ApiError } from '../utils/apiError.js';

/**
 * @route   GET /api/products
 * @desc    Fetch paginated catalog products with category filter and search query
 */
export const getProducts = asyncHandler(async (req, res) => {
  const { category, search, page = 1, limit = 50 } = req.query;

  const pageNum = Math.max(1, parseInt(page, 10) || 1);
  const limitNum = Math.min(100, Math.max(1, parseInt(limit, 10) || 50));
  const skip = (pageNum - 1) * limitNum;

  const filter = {};

  if (category && category.trim()) {
    filter.category = category.trim();
  }

  if (search && search.trim()) {
    const searchRegex = { $regex: search.trim(), $options: 'i' };
    filter.$or = [
      { title: searchRegex },
      { sku: searchRegex },
      { category: searchRegex },
    ];
  }

  const [products, total] = await Promise.all([
    Product.find(filter)
      .skip(skip)
      .limit(limitNum)
      .sort({ createdAt: -1 })
      .lean(),
    Product.countDocuments(filter),
  ]);

  return new ApiResponse(
    200,
    {
      products,
      pagination: {
        total,
        page: pageNum,
        pages: Math.ceil(total / limitNum) || 1,
        limit: limitNum,
      },
    },
    'Products retrieved successfully'
  ).send(res);
});

/**
 * @route   GET /api/products/:id
 * @desc    Fetch single product by MongoDB ID
 */
export const getProductById = asyncHandler(async (req, res) => {
  const { id } = req.params;

  if (!mongoose.isValidObjectId(id)) {
    throw new ApiError(404, 'Product not found: invalid ID format');
  }

  const product = await Product.findById(id).lean();

  if (!product) {
    throw new ApiError(404, 'Product not found');
  }

  return new ApiResponse(200, product, 'Product retrieved successfully').send(res);
});
