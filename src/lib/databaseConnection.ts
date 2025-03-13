/**
 * MongoDB Database Connection Manager
 *
 * This file manages the connection to MongoDB using Mongoose, implementing
 * connection pooling and caching to optimize performance in Next.js's
 * serverless environment. It handles connection reuse to prevent creating
 * too many connections during development hot reloads or in production.
 */

import mongoose from 'mongoose';

// Define global mongoose type to support connection caching
declare global {
  var mongoose: any; // This is to prevent connection pool errors with NextJS hot reloading
}

// Get MongoDB connection string from environment variables
const MONGODB_URI = process.env.MONGODB_URI as string;

// Ensure the connection string is defined
if (!MONGODB_URI) {
  throw new Error('Please define the MONGODB_URI environment variable inside .env.local');
}

/**
 * Global cache for the Mongoose connection
 *
 * This approach maintains a cached connection across hot reloads
 * in development, preventing connections from growing exponentially
 * during API Route usage.
 */
let cached = global.mongoose;

if (!cached) {
  cached = global.mongoose = { conn: null, promise: null };
}

/**
 * Connects to MongoDB using connection pooling and caching
 *
 * This function either returns an existing cached connection or
 * creates a new connection to MongoDB. It implements a singleton pattern
 * to ensure only one connection is active at a time.
 *
 * Connection options are configured for optimal performance in a serverless
 * environment with appropriate timeouts and buffer settings.
 *
 * @returns A promise that resolves to the Mongoose connection instance
 * @throws Error if connection fails
 */
export async function connectToDatabase() {
  // Return cached connection if it exists
  if (cached.conn) {
    return cached.conn;
  }

  // Create a new connection promise if none exists
  if (!cached.promise) {
    const opts = {
      bufferCommands: false,
      serverSelectionTimeoutMS: 5000, // Timeout after 5 seconds instead of 30
      connectTimeoutMS: 10000, // Give up initial connection after 10 seconds
    };

    console.log(`Connecting to MongoDB: ${MONGODB_URI.replace(/:[^:]*@/, ':****@')}`);

    cached.promise = mongoose
      .connect(MONGODB_URI, opts)
      .then((mongoose) => {
        console.log('Connected to MongoDB successfully');
        return mongoose;
      })
      .catch((error) => {
        console.error('MongoDB connection error:', error);
        cached.promise = null;
        throw new Error(`Unable to connect to MongoDB: ${error.message || 'Unknown error'}`);
      });
  }

  // Wait for the connection to be established
  try {
    cached.conn = await cached.promise;
  } catch (e: any) {
    cached.promise = null;
    const errorMessage = e?.message || 'Unknown error';
    console.error(`MongoDB connection failed: ${errorMessage}`);
    throw new Error(`Failed to connect to MongoDB: ${errorMessage}`);
  }

  return cached.conn;
}

/**
 * Safely get a Mongoose model
 *
 * This helper function prevents the "Schema hasn't been registered for model" error
 * by ensuring a model is only registered once, regardless of how many times it's requested.
 *
 * @param modelName The name of the model to get
 * @param schema The schema to use if the model doesn't exist
 * @returns The Mongoose model
 */
export function getModel<T>(modelName: string, schema: mongoose.Schema<T>) {
  return mongoose.models[modelName] || mongoose.model<T>(modelName, schema);
}
