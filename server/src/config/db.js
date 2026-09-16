import mongoose from 'mongoose';

const connectDB = async () => {
  try {
    const mongoUri = process.env.MONGODB_URL;

    if (!mongoUri) {
      throw new Error('MONGODB_URL is not defined in environment variables');
    }

    if (mongoUri.includes('<db_username>') || mongoUri.includes('<username>')) {
      console.warn(
        '\x1b[33m%s\x1b[0m',
        '⚠️ Warning: MONGODB_URL contains placeholder username/password. Please update .env with valid credentials.'
      );
    }

    const conn = await mongoose.connect(mongoUri, {
      serverSelectionTimeoutMS: 5000,
    });

    console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
    return conn;
  } catch (error) {
    console.error(`❌ MongoDB Connection Error: ${error.message}`);
    // Don't crash immediately so the server can run and return helpful error messages
    return null;
  }
};

export default connectDB;
