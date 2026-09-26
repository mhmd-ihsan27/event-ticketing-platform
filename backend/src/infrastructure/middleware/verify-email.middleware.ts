import { Response, NextFunction } from 'express';
import { AuthenticatedRequest } from './auth.middleware.js';
import { prisma } from '../database/prisma.client.js';

/**
 * requireEmailVerified — Middleware to enforce email verification.
 * Requires user to be authenticated first (must follow authenticateToken middleware).
 */
export async function requireEmailVerified(
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction,
): Promise<void> {
  const userId = req.user?.userId;

  if (!userId) {
    res.status(401).json({
      success: false,
      message: 'Akses ditolak: User belum terautentikasi.',
      errorCode: 'UNAUTHENTICATED',
    });
    return;
  }

  try {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { isVerified: true },
    });

    if (!user || !user.isVerified) {
      res.status(403).json({
        success: false,
        message: 'Akses ditolak: Alamat email Anda belum terverifikasi. Silakan verifikasi email terlebih dahulu.',
        errorCode: 'EMAIL_NOT_VERIFIED',
      });
      return;
    }

    next();
  } catch (error) {
    next(error);
  }
}
