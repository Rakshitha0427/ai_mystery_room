import { AppError } from '../utils/errors.js';
export function errorHandler(err, req, res, next) {
  if (res.headersSent) return next(err);
  const known = err instanceof AppError;
  const status = known ? err.status : 500;
  const code = known ? err.code : 'INTERNAL_SERVER_ERROR';
  const message = known ? err.message : 'Something went wrong. Please try again later.';
  if (!known) console.error('Request failed:', { method: req.method, path: req.path, name: err?.name });
  res.status(status).json({ success: false, error: { code, message } });
}
