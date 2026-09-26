/**
 * AppError — Structured operational error for the application.
 *
 * Usage (in Service or Repository):
 *   throw new AppError('Email sudah terdaftar.', 409, 'EMAIL_EXISTS');
 *
 * Usage (in Controller — catch block):
 *   if (error instanceof AppError) {
 *     res.status(error.statusCode).json({ success: false, message: error.message });
 *     return;
 *   }
 *   next(error); // unknown errors → Global Error Handler
 */
export class AppError extends Error {
  public readonly statusCode: number;
  public readonly errorCode: string;
  public readonly isOperational: boolean;

  constructor(
    message: string,
    statusCode: number = 500,
    errorCode: string = 'INTERNAL_ERROR',
    isOperational: boolean = true,
  ) {
    super(message);
    this.name = 'AppError';
    this.statusCode = statusCode;
    this.errorCode = errorCode;
    this.isOperational = isOperational;

    // Restore prototype chain (required for instanceof checks with Error subclasses)
    Object.setPrototypeOf(this, new.target.prototype);
    Error.captureStackTrace(this, this.constructor);
  }
}
