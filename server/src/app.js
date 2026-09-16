import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import routes from './routes/index.js';
import { notFound, errorHandler } from './middlewares/errorHandler.js';

const app = express();

// Middlewares
app.use(
  cors({
    origin: process.env.CLIENT_URL || '*',
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    credentials: true,
  })
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

// Welcome route
app.get('/', (req, res) => {
  res.json({
    message: 'Shopify Store Analytics API is running',
    version: '1.0.0',
    endpoints: {
      health: '/api/health',
      analyticsOverview: '/api/analytics/overview',
      revenueTrend: '/api/analytics/revenue-trend',
      topProducts: '/api/analytics/top-products',
      recentOrders: '/api/analytics/recent-orders',
      completeDashboard: '/api/analytics/dashboard',
      products: '/api/products',
      orders: '/api/orders',
    },
  });
});

// API Routes
app.use('/api', routes);

// Error Handling
app.use(notFound);
app.use(errorHandler);

export default app;
