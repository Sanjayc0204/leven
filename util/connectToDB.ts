// const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/conduit';

import mongoose from 'mongoose';
let isConnected = false; // Track the connection status

/**
 * Connect to MongoDB using Mongoose.
 *
 * Ensures a singleton connection is maintained throughout the application's lifecycle.
 * If already connected, the function returns immediately.
 *
 * @returns {Promise<void>} - A promise that resolves when the connection is established.
 */
export const connectToDB = async (): Promise<void> => {
  mongoose.set('strictQuery', true);

  if (isConnected) {
    console.log('MongoDB is already connected');
    return;
  }

  try {
    await mongoose.connect(process.env.MONGODB_URI as string, {
      dbName: 'Conduit'
    });

    isConnected = true;
    console.log('MongoDB connected');
  } catch (error) {
    console.error('Failed to connect to MongoDB', error);
    throw new Error('Could not connect to MongoDB');
  }
};

export default connectToDB;
