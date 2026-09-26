import cors, { CorsOptions } from 'cors';
import { RequestHandler } from 'express';

/**
 * CORS middleware with configurable origin whitelist.
 *
 * Configuration via .env:
 *   ALLOWED_ORIGINS=http://localhost:5173,http://localhost:3001
 *
 * If ALLOWED_ORIGINS is not set, defaults to allow all origins (*) in development.
 */
const getAllowedOrigins = (): string[] | string => {
  const raw = process.env.ALLOWED_ORIGINS;

  if (!raw) {
    // Open in development, restrict in production
    if (process.env.NODE_ENV === 'production') {
      console.warn('[CORS] ⚠️  ALLOWED_ORIGINS is not set in production! Denying all cross-origin requests.');
      return [];
    }
    return '*';
  }

  return raw.split(',').map((origin) => origin.trim());
};

const corsOptions: CorsOptions = {
  origin: getAllowedOrigins(),
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true,
  optionsSuccessStatus: 200,
};

export const corsMiddleware: RequestHandler = cors(corsOptions);
