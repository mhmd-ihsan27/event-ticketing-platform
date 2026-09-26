import morgan from 'morgan';
import { RequestHandler } from 'express';

/**
 * HTTP request logger middleware using Morgan.
 * - Development: compact 'dev' format (colored, human-readable)
 * - Production: 'combined' Apache-style format (full info for log aggregators)
 */
export const loggerMiddleware: RequestHandler = morgan(
  process.env.NODE_ENV === 'production' ? 'combined' : 'dev'
);
