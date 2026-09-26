import { hashPassword, comparePassword } from '../../shared/utils/password.util.js';
import { generateAccessToken, generateRefreshToken, verifyRefreshToken } from '../../shared/utils/jwt.util.js';
import { AppError } from '../../shared/errors/app-error.js';
import { AuthRepository } from './auth.repository.js';
import { emailService, EmailService } from '../../infrastructure/services/email.service.js';
import {
  RegisterDTO,
  LoginDTO,
  RegisterResultDTO,
  PendingRegisterResultDTO,
  LoginResultDTO,
  RefreshResultDTO,
} from './auth.dto.js';

/**
 * AuthService — Business Logic Layer for the Auth module.
 *
 * Responsibility:
 *   - Orchestrate auth operations (register, login, refresh, logout, email verification)
 *   - Apply business rules (password hashing, token generation, validation)
 *   - Throw structured AppError — never raw Error strings
 *
 * Consumed by: AuthController
 * Depends on:  AuthRepository (data access)
 */
export class AuthService {
  constructor(
    private readonly authRepository: AuthRepository,
    private readonly mailerService: EmailService = emailService,
  ) {}

  /**
   * Helper function to generate 6-digit numeric OTP code.
   */
  private generateOtpCode(): string {
    return Math.floor(100000 + Math.random() * 900000).toString();
  }

  // ─────────────────────────────────────────────────────────────
  // Register (Step 1 — Store in Pending Registration, send OTP)
  // ─────────────────────────────────────────────────────────────

  /**
   * Initiate registration by storing temporary credential in pending_registrations
   * and sending 6-digit OTP. User record is NOT inserted into main 'users' table until OTP is verified.
   */
  async register(data: RegisterDTO): Promise<PendingRegisterResultDTO> {
    // [Rule] Check if email is already registered in main users table
    const existingUser = await this.authRepository.findByEmail(data.email);
    if (existingUser) {
      throw new AppError('Email sudah terdaftar di sistem.', 409, 'EMAIL_EXISTS');
    }

    // Hash password
    const passwordHash = await hashPassword(data.password);
    const otp = this.generateOtpCode();
    const expiresAt = new Date(Date.now() + 15 * 60 * 1000); // 15 minutes TTL

    // Save to pending_registrations table (Upsert if re-registering before verifying)
    await this.authRepository.savePendingRegistration({
      name: data.name,
      email: data.email,
      passwordHash,
      code: otp,
      expiresAt,
    });

    // Send 6-digit OTP code to email
    await this.mailerService.sendVerificationOtp(data.email, data.name, otp);

    return {
      message: 'Registrasi diawali. Silakan cek email Anda untuk memasukkan 6-digit kode OTP verifikasi.',
      email: data.email,
    };
  }

  // ─────────────────────────────────────────────────────────────
  // Email Verification (Step 2 — Verify OTP & create User record)
  // ─────────────────────────────────────────────────────────────

  /**
   * Verify OTP code and insert user record into main 'users' table upon success.
   */
  async verifyEmail(email: string, code: string): Promise<RegisterResultDTO> {
    // Check if email already verified/registered in main users table
    const existingUser = await this.authRepository.findByEmail(email);
    if (existingUser) {
      throw new AppError('Alamat email ini telah terverifikasi dan terdaftar di sistem.', 400, 'ALREADY_VERIFIED');
    }

    // Verify OTP in pending_registrations
    const pendingRegistration = await this.authRepository.findValidPendingRegistration(email, code);
    if (!pendingRegistration) {
      throw new AppError('Kode OTP tidak valid atau telah kadaluwarsa.', 400, 'INVALID_OTP');
    }

    // Create user in main 'users' table as verified
    const newVerifiedUser = await this.authRepository.createVerifiedUser({
      name: pendingRegistration.name,
      email: pendingRegistration.email,
      passwordHash: pendingRegistration.passwordHash,
    });

    // Remove pending registration record
    await this.authRepository.deletePendingRegistration(email);

    return newVerifiedUser;
  }

  /**
   * Resend 6-digit verification OTP code for pending registration.
   */
  async resendVerificationOtp(email: string): Promise<{ message: string }> {
    // Check if email already verified
    const existingUser = await this.authRepository.findByEmail(email);
    if (existingUser) {
      throw new AppError('Alamat email ini sudah terverifikasi.', 400, 'ALREADY_VERIFIED');
    }

    const pendingRegistration = await this.authRepository.findPendingByEmail(email);
    if (!pendingRegistration) {
      throw new AppError('Data pendaftaran tidak ditemukan. Silakan lakukan registrasi ulang.', 404, 'PENDING_REGISTRATION_NOT_FOUND');
    }

    const otp = this.generateOtpCode();
    const expiresAt = new Date(Date.now() + 15 * 60 * 1000); // 15 minutes TTL

    await this.authRepository.savePendingRegistration({
      name: pendingRegistration.name,
      email: pendingRegistration.email,
      passwordHash: pendingRegistration.passwordHash,
      code: otp,
      expiresAt,
    });

    await this.mailerService.sendVerificationOtp(email, pendingRegistration.name, otp);

    return {
      message: 'Kode OTP verifikasi baru telah dikirimkan ke email Anda.',
    };
  }


  // ─────────────────────────────────────────────────────────────
  // Login
  // ─────────────────────────────────────────────────────────────

  /**
   * Authenticate user and issue JWT access + refresh tokens.
   */
  async login(data: LoginDTO): Promise<LoginResultDTO> {
    const user = await this.authRepository.findByEmail(data.email);

    // [Rule] Generic error for security — do not reveal if email exists
    if (!user) {
      throw new AppError('Email atau password salah.', 401, 'INVALID_CREDENTIALS');
    }

    // [Rule] Account must be active
    if (!user.isActive) {
      throw new AppError(
        'Akun Anda dinonaktifkan. Silakan hubungi administrator.',
        403,
        'ACCOUNT_INACTIVE',
      );
    }

    // [Rule] Password must match hash
    const isPasswordValid = await comparePassword(data.password, user.passwordHash);
    if (!isPasswordValid) {
      throw new AppError('Email atau password salah.', 401, 'INVALID_CREDENTIALS');
    }

    // Issue tokens
    const payload = { userId: user.id, email: user.email, role: user.role };
    const accessToken = generateAccessToken(payload);
    const refreshToken = generateRefreshToken(payload);

    // Persist refresh token — 7 days TTL
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 7);
    await this.authRepository.saveRefreshToken(user.id, refreshToken, expiresAt);

    return {
      tokens: {
        accessToken,
        refreshToken,
        expiresIn: process.env.JWT_EXPIRES_IN || '15m',
      },
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    };
  }

  // ─────────────────────────────────────────────────────────────
  // Get Profile
  // ─────────────────────────────────────────────────────────────

  /**
   * Fetch the authenticated user's profile by ID.
   */
  async getProfile(userId: string) {
    const user = await this.authRepository.findById(userId);

    if (!user) {
      throw new AppError('Data user tidak ditemukan.', 404, 'USER_NOT_FOUND');
    }

    return user;
  }

  // ─────────────────────────────────────────────────────────────
  // Refresh Token
  // ─────────────────────────────────────────────────────────────

  /**
   * Validate a refresh token and issue a new access token.
   */
  async refreshAccessToken(token: string): Promise<RefreshResultDTO> {
    // [Rule] Token must be cryptographically valid
    let decoded: ReturnType<typeof verifyRefreshToken>;
    try {
      decoded = verifyRefreshToken(token);
    } catch {
      throw new AppError(
        'Refresh token tidak valid atau telah kadaluwarsa.',
        401,
        'INVALID_REFRESH_TOKEN',
      );
    }

    // [Rule] Token must exist in database and not be revoked/expired
    const storedToken = await this.authRepository.findRefreshToken(token);
    if (!storedToken || storedToken.isRevoked || storedToken.expiresAt < new Date()) {
      throw new AppError(
        'Refresh token tidak valid atau telah kadaluwarsa.',
        401,
        'INVALID_REFRESH_TOKEN',
      );
    }

    const newAccessToken = generateAccessToken({
      userId: decoded.userId,
      email: decoded.email,
      role: decoded.role,
    });

    return {
      accessToken: newAccessToken,
      expiresIn: process.env.JWT_EXPIRES_IN || '15m',
    };
  }

  // ─────────────────────────────────────────────────────────────
  // Logout
  // ─────────────────────────────────────────────────────────────

  /**
   * Revoke the given refresh token (session logout).
   */
  async logout(token: string): Promise<void> {
    await this.authRepository.revokeRefreshToken(token);
  }
}

