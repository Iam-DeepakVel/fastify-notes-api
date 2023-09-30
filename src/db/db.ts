import mongoose from 'mongoose';
import fastify from 'fastify';

export async function connectDB() {
  try {
    await mongoose.connect(process.env.MONGO_URI!);
  } catch (error) {
    fastify().log.error(error, 'Error connecting to Database');
  }
}
