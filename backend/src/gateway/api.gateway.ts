import { Application, Request, Response, Router } from 'express';
import express from 'express';
import { loggerMiddleware } from './middleware/logger.middleware.js';
import { securityMiddleware } from './middleware/security.middleware.js';
import { corsMiddleware } from './middleware/cors.middleware.js';
import { globalRateLimiter, authRateLimiter } from './middleware/rate-limit.middleware.js';
import { globalErrorHandler, notFoundHandler } from './middleware/error-handler.middleware.js';

/**
 * API Gateway
 *
 * Applies all cross-cutting middleware in the correct order:
 *   1. Logger       — Log every incoming request
 *   2. Security     — Helmet HTTP security headers
 *   3. CORS         — Cross-origin access control
 *   4. Body Parser  — Parse JSON bodies (max 1MB)
 *   5. Rate Limiter — Global request throttling per IP
 *   6. Routes       — Mount all API routers under /api/v1
 *   7. 404 Handler  — Catch all unmatched routes
 *   8. Error Handler — Central error formatting
 *
 * @param app     Express Application instance
 * @param router  The main API router containing all module routes
 */
export function applyGateway(app: Application, router: Router): void {
  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  // [1] Request Logger
  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  app.use(loggerMiddleware);

  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  // [2] Security Headers (Helmet)
  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  app.use(securityMiddleware);

  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  // [3] CORS
  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  app.use(corsMiddleware);

  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  // [4] Body Parser — JSON max 1MB
  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  app.use(express.json({ limit: '1mb' }));
  app.use(express.urlencoded({ extended: true, limit: '1mb' }));

  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  // [5] Global Rate Limiter
  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  app.use('/api', globalRateLimiter);

  // Stricter rate limit for auth endpoints
  app.use('/api/v1/auth', authRateLimiter);

  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  // [6] Health Check Endpoint
  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  app.get('/health', (req: Request, res: Response) => {
    res.status(200).json({
      success: true,
      status: 'OK',
      service: 'Manajemen Event & Tiket Digital API',
      version: process.env.npm_package_version || '1.0.0',
      environment: process.env.NODE_ENV || 'development',
      uptime: `${Math.floor(process.uptime())}s`,
      timestamp: new Date().toISOString(),
    });
  });

  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  // [7] API Routes
  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  app.use('/api/v1', router);

  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  // [8a] 404 Not Found — must be after all routes
  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  app.use(notFoundHandler);

  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  // [8b] Global Error Handler — must be last
  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  app.use(globalErrorHandler);
}
