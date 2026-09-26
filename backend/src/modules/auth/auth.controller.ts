import { Request, Response, NextFunction } from 'express';
import { AuthService } from './auth.service.js';
import { AppError } from '../../shared/errors/app-error.js';
import { AuthenticatedRequest } from '../../infrastructure/middleware/auth.middleware.js';
import { RegisterDTO, LoginDTO } from './auth.dto.js';

/**
 * AuthController — HTTP Layer for the Auth module.
 *
 * Responsibility:
 *   - Parse and validate incoming HTTP request data
 *   - Delegate business logic to AuthService
 *   - Format and send HTTP responses
 *   - Forward unexpected errors to the Global Error Handler via next()
 *
 * Depends on: AuthService (injected via constructor)
 */
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  // ─────────────────────────────────────────────────────────────
  // POST /api/v1/auth/register
  // ─────────────────────────────────────────────────────────────

  /**
   * @swagger
   * /auth/register:
   *   post:
   *     summary: Registrasi akun pengguna baru
   *     tags: [Auth]
   *     security: []
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             $ref: '#/components/schemas/RegisterRequest'
   *     responses:
   *       201:
   *         description: Registrasi berhasil
   *       400:
   *         description: Validasi input gagal
   *       409:
   *         description: Email sudah terdaftar
   */
  async register(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      // req.body already validated & transformed by Zod middleware (validate(RegisterSchema))
      const { name, email, password } = req.body as RegisterDTO;

      const result = await this.authService.register({ name, email, password });

      res.status(200).json({
        success: true,
        message: result.message,
        data: { email: result.email },
      });
    } catch (error) {
      if (error instanceof AppError) {
        res.status(error.statusCode).json({
          success: false,
          message: error.message,
          errorCode: error.errorCode,
        });
        return;
      }
      next(error); // Unknown error → Global Error Handler
    }
  }

  // ─────────────────────────────────────────────────────────────
  // POST /api/v1/auth/login
  // ─────────────────────────────────────────────────────────────

  /**
   * @swagger
   * /auth/login:
   *   post:
   *     summary: Login dan dapatkan access token
   *     tags: [Auth]
   *     security: []
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             $ref: '#/components/schemas/LoginRequest'
   *     responses:
   *       200:
   *         description: Login berhasil, token dikembalikan
   *       400:
   *         description: Input tidak lengkap
   *       401:
   *         description: Kredensial tidak valid
   *       403:
   *         description: Akun tidak aktif
   */
  async login(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      // req.body already validated & transformed by Zod middleware (validate(LoginSchema))
      const { email, password } = req.body as LoginDTO;

      const result = await this.authService.login({ email, password });

      res.status(200).json({
        success: true,
        message: 'Login berhasil.',
        data: result,
      });
    } catch (error) {
      if (error instanceof AppError) {
        res.status(error.statusCode).json({
          success: false,
          message: error.message,
          errorCode: error.errorCode,
        });
        return;
      }
      next(error);
    }
  }

  // ─────────────────────────────────────────────────────────────
  // GET /api/v1/auth/me
  // ─────────────────────────────────────────────────────────────

  /**
   * @swagger
   * /auth/me:
   *   get:
   *     summary: Ambil profil user yang sedang login
   *     tags: [Auth]
   *     security:
   *       - BearerAuth: []
   *     responses:
   *       200:
   *         description: Profil user berhasil diambil
   *       401:
   *         description: Token tidak valid atau tidak disertakan
   *       404:
   *         description: User tidak ditemukan
   */
  async getProfile(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const userId = req.user?.userId;
      if (!userId) {
        res.status(401).json({
          success: false,
          message: 'User belum terautentikasi.',
          errorCode: 'UNAUTHENTICATED',
        });
        return;
      }

      const user = await this.authService.getProfile(userId);

      res.status(200).json({
        success: true,
        message: 'Profil berhasil diambil.',
        data: { user },
      });
    } catch (error) {
      if (error instanceof AppError) {
        res.status(error.statusCode).json({
          success: false,
          message: error.message,
          errorCode: error.errorCode,
        });
        return;
      }
      next(error);
    }
  }

  // ─────────────────────────────────────────────────────────────
  // POST /api/v1/auth/refresh
  // ─────────────────────────────────────────────────────────────

  /**
   * @swagger
   * /auth/refresh:
   *   post:
   *     summary: Perbarui access token menggunakan refresh token
   *     tags: [Auth]
   *     security: []
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             required: [refreshToken]
   *             properties:
   *               refreshToken:
   *                 type: string
   *     responses:
   *       200:
   *         description: Access token baru berhasil diterbitkan
   *       401:
   *         description: Refresh token tidak valid atau kadaluwarsa
   */
  async refreshToken(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      // req.body already validated by Zod middleware (validate(RefreshTokenSchema))
      const { refreshToken } = req.body;

      const result = await this.authService.refreshAccessToken(refreshToken);

      res.status(200).json({
        success: true,
        message: 'Token berhasil diperbarui.',
        data: result,
      });
    } catch (error) {
      if (error instanceof AppError) {
        res.status(error.statusCode).json({
          success: false,
          message: error.message,
          errorCode: error.errorCode,
        });
        return;
      }
      next(error);
    }
  }

  // ─────────────────────────────────────────────────────────────
  // POST /api/v1/auth/logout
  // ─────────────────────────────────────────────────────────────

  /**
   * @swagger
   * /auth/logout:
   *   post:
   *     summary: Logout dan revoke refresh token
   *     tags: [Auth]
   *     security: []
   *     requestBody:
   *       required: false
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             properties:
   *               refreshToken:
   *                 type: string
   *     responses:
   *       200:
   *         description: Logout berhasil
   */
  async logout(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { refreshToken } = req.body;

      if (refreshToken) {
        await this.authService.logout(refreshToken);
      }

      res.status(200).json({
        success: true,
        message: 'Logout berhasil.',
      });
    } catch (error) {
      next(error);
    }
  }

  // ─────────────────────────────────────────────────────────────
  // POST /api/v1/auth/verify-email
  // ─────────────────────────────────────────────────────────────

  /**
   * @swagger
   * /auth/verify-email:
   *   post:
   *     summary: Verifikasi email menggunakan 6-digit kode OTP
   *     tags: [Auth]
   *     security: []
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             required: [email, code]
   *             properties:
   *               email:
   *                 type: string
   *                 example: john@example.com
   *               code:
   *                 type: string
   *                 example: "123456"
   *     responses:
   *       200:
   *         description: Email berhasil diverifikasi
   *       400:
   *         description: Kode OTP tidak valid / kadaluwarsa / email sudah terverifikasi
   *       404:
   *         description: User tidak ditemukan
   */
  async verifyEmail(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { email, code } = req.body;

      const user = await this.authService.verifyEmail(email, code);

      res.status(200).json({
        success: true,
        message: 'Alamat email berhasil diverifikasi.',
        data: { user },
      });
    } catch (error) {
      if (error instanceof AppError) {
        res.status(error.statusCode).json({
          success: false,
          message: error.message,
          errorCode: error.errorCode,
        });
        return;
      }
      next(error);
    }
  }

  // ─────────────────────────────────────────────────────────────
  // POST /api/v1/auth/resend-verification
  // ─────────────────────────────────────────────────────────────

  /**
   * @swagger
   * /auth/resend-verification:
   *   post:
   *     summary: Kirim ulang kode OTP verifikasi email
   *     tags: [Auth]
   *     security: []
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             required: [email]
   *             properties:
   *               email:
   *                 type: string
   *                 example: john@example.com
   *     responses:
   *       200:
   *         description: Kode OTP verifikasi berhasil dikirim ulang
   *       400:
   *         description: Email sudah terverifikasi
   *       404:
   *         description: User tidak ditemukan
   */
  async resendVerification(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { email } = req.body;

      const result = await this.authService.resendVerificationOtp(email);

      res.status(200).json({
        success: true,
        message: result.message,
      });
    } catch (error) {
      if (error instanceof AppError) {
        res.status(error.statusCode).json({
          success: false,
          message: error.message,
          errorCode: error.errorCode,
        });
        return;
      }
      next(error);
    }
  }
}

