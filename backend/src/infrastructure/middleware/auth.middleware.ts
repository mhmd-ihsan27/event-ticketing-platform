import { Request, Response, NextFunction } from 'express';
import { verifyAccessToken, JwtPayload } from '../../shared/utils/jwt.util.js';

// Extend Express Request type to include user payload
export interface AuthenticatedRequest extends Request {
  user?: JwtPayload;
}

/**
 * Middleware to authenticate requests using JWT Bearer Token
 */
export function authenticateToken(req: AuthenticatedRequest, res: Response, next: NextFunction): void {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1]; // Format: Bearer <token>

  if (!token) {
    res.status(401).json({
      success: false,
      message: 'Akses ditolak: Token autentikasi tidak ditemukan dalam header',
    });
    return;
  }

  try {
    const decoded = verifyAccessToken(token);
    req.user = decoded;
    next();
  } catch (error) {
    res.status(401).json({
      success: false,
      message: 'Akses ditolak: Token tidak valid atau telah kadaluwarsa',
    });
    return;
  }
}
