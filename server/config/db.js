const mongoose = require('mongoose');

// Serverless Mongoose caching pattern to prevent connection exhaustion on Vercel
let cached = global.mongoose;

if (!cached) {
  cached = global.mongoose = { conn: null, promise: null };
}

async function connectDB() {
  if (cached.conn) {
    return cached.conn;
  }

  if (!cached.promise) {
    const opts = {
      bufferCommands: false,
    };

    const mongoURI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/nexus2026';

    cached.promise = mongoose.connect(mongoURI, opts).then((mongooseInstance) => {
      console.log('Connected to MongoDB (Serverless Cached Connection)');
      return mongooseInstance;
    });
  }

  try {
    cached.conn = await cached.promise;
  } catch (e) {
    cached.promise = null;
    throw e;
  }

  return cached.conn;
}

module.exports = connectDB;
