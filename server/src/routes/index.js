import express from 'express';
import analyticsRoutes from './analyticsRoutes.js';
import productRoutes from './productRoutes.js';
import orderRoutes from './orderRoutes.js';

const router = express.Router();

router.get('/health', (req, res) => {
  res.status(200).json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    service: 'Shopify Store Analytics API',
  });
});

router.use('/analytics', analyticsRoutes);
router.use('/products', productRoutes);
router.use('/orders', orderRoutes);

export default router;
