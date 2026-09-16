import dotenv from 'dotenv';
dotenv.config();

import app from './app.js';
import connectDB from './config/db.js';

const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 5000;
const HOST = '0.0.0.0';

// Start server immediately on 0.0.0.0 so Render's port scanner succeeds instantly
app.listen(PORT, HOST, () => {
  console.log(`🚀 Server running on http://${HOST}:${PORT}`);
});

// Connect to MongoDB asynchronously without blocking port binding
connectDB().catch((error) => {
  console.error('❌ MongoDB Connection Error:', error.message);
});
