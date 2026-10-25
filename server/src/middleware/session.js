import { randomBytes } from 'node:crypto';
import { config } from '../config/env.js';

const COOKIE = 'mystery_session';
export function sessionMiddleware(req, res, next) {
  let sessionId = req.cookies?.[COOKIE];
  if (!sessionId || !/^[a-f0-9]{64}$/.test(sessionId)) {
    sessionId = randomBytes(32).toString('hex');
    res.cookie(COOKIE, sessionId, {
      httpOnly: true, sameSite: 'strict', secure: config.cookieSecure,
      maxAge: 1000 * 60 * 60 * 24 * 30, path: '/',
    });
  }
  req.sessionId = sessionId;
  next();
}
