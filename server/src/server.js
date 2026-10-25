import mongoose from 'mongoose';
import { app } from './app.js';
import { config } from './config/env.js';

if (!config.sessionSecret || config.sessionSecret.length < 32) {
  console.warn('SESSION_SECRET is missing or shorter than 32 characters. Set a strong secret before deployment.');
}
if (!config.mongoUri) {
  console.error('MONGODB_URI is required. Copy .env.example to server/.env and configure the database.');
  process.exit(1);
}

try {
  await mongoose.connect(config.mongoUri, { serverSelectionTimeoutMS: 10000 });
  const server = app.listen(config.port, () => console.log(`Mystery Room API listening on port ${config.port}`));
  const shutdown = async () => { server.close(); await mongoose.disconnect(); process.exit(0); };
  process.on('SIGINT', shutdown);
  process.on('SIGTERM', shutdown);
} catch (error) {
  console.error('Could not connect to MongoDB:', error?.name || 'connection error');
  process.exit(1);
}
