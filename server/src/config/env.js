import dotenv from 'dotenv';
dotenv.config();

export const config = {
  nodeEnv: process.env.NODE_ENV || 'development',
  port: Number(process.env.PORT || 5000),
  clientUrl: process.env.CLIENT_URL || 'http://localhost:5173',
  mongoUri: process.env.MONGODB_URI || '',
  geminiApiKey: process.env.GEMINI_API_KEY || '',
  geminiModel: process.env.GEMINI_MODEL || 'gemini-2.5-flash',
  sessionSecret: process.env.SESSION_SECRET || '',
  cookieSecure: process.env.COOKIE_SECURE === 'true',
  maxMysteriesPerHour: Math.max(1, Number(process.env.MAX_MYSTERIES_PER_HOUR || 5)),
};
