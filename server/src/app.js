import express from 'express';
import helmet from 'helmet';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import rateLimit from 'express-rate-limit';
import { config } from './config/env.js';
import { sessionMiddleware } from './middleware/session.js';
import { errorHandler } from './middleware/errorHandler.js';
import { mysteryRoutes } from './routes/mysteryRoutes.js';
import { AppError } from './utils/errors.js';

export const app = express();
app.disable('x-powered-by');
app.use(helmet());
app.use(cors({ origin: config.clientUrl, credentials: true }));
app.use(express.json({ limit: '20kb', type: 'application/json' }));
app.use(cookieParser());
app.use(sessionMiddleware);
const mutationOriginGuard = (req, res, next) => {
  if (['POST','PUT','PATCH','DELETE'].includes(req.method)) {
    if (req.get('origin') !== config.clientUrl) return next(new AppError(403, 'UNAUTHORIZED', 'Request origin is not allowed.'));
    if (!req.is('application/json')) return next(new AppError(415, 'VALIDATION_ERROR', 'Use a JSON request body.'));
  }
  next();
};
app.use('/api', mutationOriginGuard);
app.get('/api/health', (req, res) => res.json({ success: true, data: { status: 'ok' } }));
app.use('/api/mysteries', rateLimit({ windowMs: 60 * 60 * 1000, limit: config.maxMysteriesPerHour, standardHeaders: 'draft-7', legacyHeaders: false, skip: req => req.method !== 'POST', handler: (req, res) => res.status(429).json({ success: false, error: { code: 'RATE_LIMITED', message: 'You have reached the case creation limit. Try again later.' } }) }), mysteryRoutes);
app.use((req, res) => res.status(404).json({ success: false, error: { code: 'NOT_FOUND', message: 'That route could not be found.' } }));
app.use(errorHandler);
