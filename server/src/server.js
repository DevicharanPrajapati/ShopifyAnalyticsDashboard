import dotenv from 'dotenv';
dotenv.config();

import app from './app.js';
import connectDB from './config/db.js';

const PORT = process.env.PORT || 5000;

// Connect to Database and start server
const startServer = async () => {
  await connectDB();

  app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT} in ${process.env.NODE_ENV || 'development'} mode`);
    console.log(`👉 API Health Check: http://localhost:${PORT}/api/health`);
    console.log(`👉 Analytics API: http://localhost:${PORT}/api/analytics/dashboard`);
  });
};

startServer();
