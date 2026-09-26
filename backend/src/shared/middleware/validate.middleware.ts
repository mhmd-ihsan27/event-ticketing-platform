import { Request, Response, NextFunction } from 'express';
import { ZodSchema, ZodError } from 'zod';

/**
 * validate — Zod validation middleware factory.
 *
 * Validates req.body against the given Zod schema before the request
 * reaches the controller. On failure, returns 400 with structured errors.
 * On success, replaces req.body with the parsed (and transformed) data
 * so the controller always receives clean, type-safe input.
 *
 * Usage in routes:
 *   router.post('/register', validate(RegisterSchema), (req, res, next) => controller.register(req, res, next));
 *
 * @param schema  Any Zod schema (ZodObject, ZodEffects, etc.)
 */
export function validate<T>(schema: ZodSchema<T>) {
  return (req: Request, res: Response, next: NextFunction): void => {
    const result = schema.safeParse(req.body);

    if (!result.success) {
      const errors = formatZodErrors(result.error);

      res.status(400).json({
        success: false,
        message: 'Validasi input gagal.',
        errorCode: 'VALIDATION_ERROR',
        errors,
      });
      return;
    }

    // Replace req.body with parsed data (trimmed, lowercased, etc.)
    req.body = result.data;
    next();
  };
}

/**
 * Format ZodError into a flat, user-friendly array of error messages.
 * Compatible with Zod v4 (uses .issues instead of .errors)
 *
 * Output example:
 * [
 *   { field: "email", message: "Format email tidak valid." },
 *   { field: "password", message: "Password minimal 8 karakter." }
 * ]
 */
function formatZodErrors(error: ZodError): Array<{ field: string; message: string }> {
  return error.issues.map((issue) => ({
    field: issue.path.join('.') || 'body',
    message: issue.message,
  }));
}
