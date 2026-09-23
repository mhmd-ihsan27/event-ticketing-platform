import { Response, NextFunction } from 'express';
import { Role } from '@prisma/client';
import { AuthenticatedRequest } from './auth.middleware.js';

/**
 * Middleware to authorize requests based on user roles
 * Example: authorizeRoles(Role.ADMIN, Role.ORGANIZER)
 */
export function authorizeRoles(...allowedRoles: Role[]) {
  return (req: AuthenticatedRequest, res: Response, next: NextFunction): void => {
    if (!req.user) {
      res.status(401).json({
        success: false,
        message: 'Akses ditolak: User belum terautentikasi',
      });
      return;
    }

    if (!allowedRoles.includes(req.user.role)) {
      res.status(403).json({
        success: false,
        message: `Akses dilarang: Role '${req.user.role}' tidak memiliki izin untuk mengakses resource ini`,
      });
      return;
    }

    next();
  };
}
