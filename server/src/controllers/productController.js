/**
 * @file productController.js
 * @description Controller for querying, searching, and managing store products and catalog inventory.
 */

import mongoose from 'mongoose';
import Product from '../models/Product.js';
import { asyncHandler } from '../utils/asyncHandler.js';

/**
 * @route   GET /api/products
 * @desc    Fetch paginated catalog products with category filter and search query
 */
export const getProducts = asyncHandler(async (req, res) => {
  const { category, search, page = 1, limit = 50 } = req.query;

  const pageNum = Math.max(1, parseInt(page, 10) || 1);
  const limitNum = Math.min(100, Math.max(1, parseInt(limit, 10) || 50));
  const skip = (pageNum - 1) * limitNum;

  // Base filter for current single-store setup
  const filter = {};

  if (category && category.trim()) {
    filter.category = category.trim();
  }

  if (search && search.trim()) {
    filter.title = { $regex: search.trim(), $options: 'i' };
  }

  const [products, total] = await Promise.all([
    Product.find(filter)
      .skip(skip)
      .limit(limitNum)
      .sort({ createdAt: -1 })
      .lean(),
    Product.countDocuments(filter),
  ]);

  res.status(200).json({
    success: true,
    data: {
      products,
      pagination: {
        total,
        page: pageNum,
        pages: Math.ceil(total / limitNum) || 1,
        limit: limitNum,
      },
    },
  });
});

/**
 * @route   GET /api/products/:id
 * @desc    Fetch single product by MongoDB ID
 */
export const getProductById = asyncHandler(async (req, res) => {
  const { id } = req.params;

  if (!mongoose.isValidObjectId(id)) {
    return res.status(404).json({
      success: false,
      message: 'Product not found: invalid ID format',
    });
  }

  const product = await Product.findById(id).lean();

  if (!product) {
    return res.status(404).json({
      success: false,
      message: 'Product not found',
    });
  }

  res.status(200).json({
    success: true,
    data: product,
  });
});
