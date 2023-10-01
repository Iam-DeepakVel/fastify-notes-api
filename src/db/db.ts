import mongoose from 'mongoose';
import fastify from 'fastify';

export async function connectDB() {
  try {
    await mongoose.connect(process.env.MONGO_URI!);
    fastify().log.info('Connected to database');
  } catch (error) {
    fastify().log.error(error, 'Error connecting to Database');
    process.exit(1);
  }
}

export async function disconnectDB() {
  return mongoose.connection.close();
}
