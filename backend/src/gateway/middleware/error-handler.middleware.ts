import { Request, Response, NextFunction } from 'express';
import { AppError } from '../../shared/errors/app-error.js';

/**
 * Global Error Handler Middleware.
 *
 * Catches all errors passed via next(err) from any route or middleware
 * and formats them into a consistent JSON response.
 *
 * Error types handled:
 * - AppError (operational, from service/repository layer)
 * - SyntaxError (invalid JSON body from body-parser)
 * - Generic 500 Internal Server Error
 */
export function globalErrorHandler(
  err: Error,
  req: Request,
  res: Response,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  next: NextFunction,
): void {
  // Log error details to server console
  console.error(`[Error Handler] ${req.method} ${req.originalUrl}`, {
    name: err.name,
    message: err.message,
    stack: process.env.NODE_ENV === 'development' ? err.stack : undefined,
  });

  // Handle malformed JSON body (from body-parser)
  if (err instanceof SyntaxError && 'body' in err) {
    res.status(400).json({
      success: false,
      message: 'Format JSON pada request body tidak valid.',
      errorCode: 'INVALID_JSON',
    });
    return;
  }

  // Handle known operational AppErrors (from services / repositories)
  if (err instanceof AppError) {
    res.status(err.statusCode).json({
      success: false,
      message: err.message,
      errorCode: err.errorCode,
      ...(process.env.NODE_ENV === 'development' && { stack: err.stack }),
    });
    return;
  }

  // Fallback — unknown / programming errors
  const message =
    process.env.NODE_ENV === 'production'
      ? 'Terjadi kesalahan internal pada server. Silakan coba lagi nanti.'
      : err.message || 'Terjadi kesalahan pada server.';

  res.status(500).json({
    success: false,
    message,
    errorCode: 'INTERNAL_SERVER_ERROR',
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack }),
  });
}

/**
 * 404 Not Found handler for undefined routes.
 * Must be registered AFTER all routes.
 */
export function notFoundHandler(req: Request, res: Response): void {
  res.status(404).json({
    success: false,
    message: `Route [${req.method}] ${req.originalUrl} tidak ditemukan.`,
    errorCode: 'ROUTE_NOT_FOUND',
  });
}
