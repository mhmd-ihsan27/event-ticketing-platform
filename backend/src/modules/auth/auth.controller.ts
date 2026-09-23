import { Request, Response } from 'express';
import { AuthService } from './auth.service.js';
import { AuthenticatedRequest } from '../../infrastructure/middleware/auth.middleware.js';

const authService = new AuthService();

export class AuthController {
  /**
   * POST /api/v1/auth/register
   */
  async register(req: Request, res: Response): Promise<void> {
    try {
      const { name, email, password } = req.body;

      if (!name || !email || !password) {
        res.status(400).json({
          success: false,
          message: 'Kolom name, email, dan password wajib diisi',
        });
        return;
      }

      if (password.length < 6) {
        res.status(400).json({
          success: false,
          message: 'Password minimal 6 karakter',
        });
        return;
      }

      const user = await authService.register({ name, email, password });

      res.status(201).json({
        success: true,
        message: 'Registrasi akun berhasil',
        data: { user },
      });
    } catch (error: any) {
      if (error.message === 'EMAIL_EXISTS') {
        res.status(409).json({
          success: false,
          message: 'Email sudah terdaftar di sistem',
        });
        return;
      }

      res.status(500).json({
        success: false,
        message: 'Terjadi kesalahan pada server saat registrasi',
      });
    }
  }

  /**
   * POST /api/v1/auth/login
   */
  async login(req: Request, res: Response): Promise<void> {
    try {
      const { email, password } = req.body;

      if (!email || !password) {
        res.status(400).json({
          success: false,
          message: 'Kolom email dan password wajib diisi',
        });
        return;
      }

      const result = await authService.login({ email, password });

      res.status(200).json({
        success: true,
        message: 'Login berhasil',
        data: result,
      });
    } catch (error: any) {
      if (error.message === 'INVALID_CREDENTIALS') {
        res.status(401).json({
          success: false,
          message: 'Email atau password salah',
        });
        return;
      }

      if (error.message === 'ACCOUNT_INACTIVE') {
        res.status(403).json({
          success: false,
          message: 'Akun Anda dinonaktifkan. Silakan hubungi administrator',
        });
        return;
      }

      res.status(500).json({
        success: false,
        message: 'Terjadi kesalahan pada server saat login',
      });
    }
  }

  /**
   * GET /api/v1/auth/me
   */
  async getProfile(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      const userId = req.user?.userId;
      if (!userId) {
        res.status(401).json({
          success: false,
          message: 'User belum terautentikasi',
        });
        return;
      }

      const user = await authService.getProfile(userId);

      res.status(200).json({
        success: true,
        message: 'Profil berhasil diambil',
        data: { user },
      });
    } catch (error: any) {
      res.status(404).json({
        success: false,
        message: 'Data user tidak ditemukan',
      });
    }
  }

  /**
   * POST /api/v1/auth/refresh
   */
  async refreshToken(req: Request, res: Response): Promise<void> {
    try {
      const { refreshToken } = req.body;

      if (!refreshToken) {
        res.status(400).json({
          success: false,
          message: 'Refresh token wajib disertakan',
        });
        return;
      }

      const result = await authService.refreshAccessToken(refreshToken);

      res.status(200).json({
        success: true,
        message: 'Token berhasil diperbarui',
        data: result,
      });
    } catch (error: any) {
      res.status(401).json({
        success: false,
        message: 'Refresh token tidak valid atau telah kadaluwarsa',
      });
    }
  }

  /**
   * POST /api/v1/auth/logout
   */
  async logout(req: Request, res: Response): Promise<void> {
    try {
      const { refreshToken } = req.body;

      if (refreshToken) {
        await authService.logout(refreshToken);
      }

      res.status(200).json({
        success: true,
        message: 'Logout berhasil',
      });
    } catch (error: any) {
      res.status(500).json({
        success: false,
        message: 'Terjadi kesalahan saat logout',
      });
    }
  }
}
