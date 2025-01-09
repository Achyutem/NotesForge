import mongoose from 'mongoose';
import { z } from 'zod';

let isConnected = false;

const envSchema = z.object({
  MONGO_URI: z.string().url("MONGO_URI must be a valid URL"),
});

const dbConnect = async () => {
  const env = envSchema.safeParse(process.env);

  if (!env.success) {
    console.error("Invalid environment variables:", env.error.errors);
    throw new Error("Invalid environment variables");
  }

  const { MONGO_URI } = env.data;

  if (isConnected) {
    console.log('Already connected to the database');
    return;
  }

  try {
    const db = await mongoose.connect(MONGO_URI);
    isConnected = db.connections[0].readyState === 1;
    console.log('Connected to the database');
  } catch (error) {
    console.error('Database connection error:', error);
    throw error;
  }
};

export default dbConnect;
