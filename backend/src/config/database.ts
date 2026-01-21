import mongoose from 'mongoose';

export const connectDB = async (): Promise<void> => {
  const mongoUri = process.env.MONGODB_URI || 'mongodb://localhost:27017/hrms';
  await mongoose.connect(mongoUri);
};

export const disconnectDB = async (): Promise<void> => {
  await mongoose.disconnect();
};
