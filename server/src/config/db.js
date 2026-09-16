import mongoose from 'mongoose';

const connectDB = async () => {
  try {
    const mongoUri = process.env.MONGODB_URL;

    if (!mongoUri) {
      console.warn('⚠️ Warning: MONGODB_URL is not defined in environment variables. Please add it in your deployment settings.');
      return null;
    }

    if (mongoUri.includes('<db_username>') || mongoUri.includes('<username>')) {
      console.warn(
        '\x1b[33m%s\x1b[0m',
        '⚠️ Warning: MONGODB_URL contains placeholder username/password. Please update with valid credentials.'
      );
    }

    const conn = await mongoose.connect(mongoUri, {
      serverSelectionTimeoutMS: 5000,
    });

    console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
    return conn;
  } catch (error) {
    console.error(`❌ MongoDB Connection Error: ${error.message}`);
    console.error('👉 Hint: Ensure your MongoDB Atlas Network Access allows connections from all IPs (0.0.0.0/0).');
    return null;
  }
};

export default connectDB;
