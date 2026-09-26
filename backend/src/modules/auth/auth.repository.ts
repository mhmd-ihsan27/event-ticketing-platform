import { Role } from '@prisma/client';
import { prisma } from '../../infrastructure/database/prisma.client.js';
import { RegisterResultDTO, UserProfileDTO } from './auth.dto.js';

/**
 * AuthRepository — Data Access Layer for the Auth module.
 *
 * Responsibility: ALL Prisma queries related to authentication.
 * No business logic here — only raw data operations.
 *
 * Consumed by: AuthService
 */
export class AuthRepository {
  // ─────────────────────────────────────────────────────────────
  // User Queries
  // ─────────────────────────────────────────────────────────────

  /**
   * Find a user by their email address (includes passwordHash for auth).
   * Returns null if not found.
   */
  async findByEmail(email: string) {
    return prisma.user.findUnique({
      where: { email },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        passwordHash: true,
        isActive: true,
        isVerified: true,
        createdAt: true,
        updatedAt: true,
      },
    });
  }

  /**
   * Find a user by their ID (no passwordHash exposed).
   * Returns null if not found.
   */
  async findById(id: string): Promise<UserProfileDTO | null> {
    return prisma.user.findUnique({
      where: { id },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        isVerified: true,
        isActive: true,
        createdAt: true,
        updatedAt: true,
      },
    });
  }

  /**
   * Create a new user record with hashed password.
   */
  async createUser(data: {
    name: string;
    email: string;
    passwordHash: string;
    role?: Role;
  }): Promise<RegisterResultDTO> {
    return prisma.user.create({
      data: {
        name: data.name,
        email: data.email,
        passwordHash: data.passwordHash,
        role: data.role ?? Role.ATTENDEE,
      },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        isVerified: true,
        createdAt: true,
      },
    });
  }

  // ─────────────────────────────────────────────────────────────
  // Refresh Token Queries
  // ─────────────────────────────────────────────────────────────

  /**
   * Persist a refresh token for a user session.
   */
  async saveRefreshToken(userId: string, token: string, expiresAt: Date) {
    return prisma.refreshToken.create({
      data: { userId, token, expiresAt },
    });
  }

  /**
   * Find a stored refresh token record.
   * Returns null if not found (already revoked or non-existent).
   */
  async findRefreshToken(token: string) {
    return prisma.refreshToken.findUnique({
      where: { token },
    });
  }

  /**
   * Revoke a refresh token (soft-delete via isRevoked flag).
   */
  async revokeRefreshToken(token: string) {
    return prisma.refreshToken.updateMany({
      where: { token },
      data: { isRevoked: true },
    });
  }

  /**
   * Revoke ALL active refresh tokens for a user (e.g., on password change).
   */
  async revokeAllUserTokens(userId: string) {
    return prisma.refreshToken.updateMany({
      where: { userId, isRevoked: false },
      data: { isRevoked: true },
    });
  }

  // ─────────────────────────────────────────────────────────────
  // Verification Token / OTP Queries
  // ─────────────────────────────────────────────────────────────

  /**
   * Create a verification OTP record for a user.
   */
  async createVerificationToken(data: {
    userId: string;
    code: string;
    expiresAt: Date;
    type?: 'EMAIL_VERIFICATION' | 'PASSWORD_RESET';
  }) {
    return prisma.verificationToken.create({
      data: {
        userId: data.userId,
        code: data.code,
        expiresAt: data.expiresAt,
        type: data.type ?? 'EMAIL_VERIFICATION',
      },
    });
  }

  /**
   * Find an active, unused verification token for a user.
   */
  async findValidVerificationToken(userId: string, code: string, type: 'EMAIL_VERIFICATION' | 'PASSWORD_RESET' = 'EMAIL_VERIFICATION') {
    return prisma.verificationToken.findFirst({
      where: {
        userId,
        code,
        type,
        isUsed: false,
        expiresAt: { gt: new Date() },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  /**
   * Mark a verification token as used.
   */
  async markTokenUsed(tokenId: string) {
    return prisma.verificationToken.update({
      where: { id: tokenId },
      data: { isUsed: true },
    });
  }

  /**
   * Invalidate older unused tokens of a specific type for a user.
   */
  async invalidateUserTokens(userId: string, type: 'EMAIL_VERIFICATION' | 'PASSWORD_RESET' = 'EMAIL_VERIFICATION') {
    return prisma.verificationToken.updateMany({
      where: { userId, type, isUsed: false },
      data: { isUsed: true },
    });
  }

  /**
   * Mark user's email as verified.
   */
  async markUserVerified(userId: string) {
    return prisma.user.update({
      where: { id: userId },
      data: { isVerified: true },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        isVerified: true,
      },
    });
  }

  // ─────────────────────────────────────────────────────────────
  // Pending Registration Queries (Temporarily stored before OTP)
  // ─────────────────────────────────────────────────────────────

  /**
   * Upsert a pending registration record.
   * If email already exists in pending, replace it with new OTP & details.
   */
  async savePendingRegistration(data: {
    name: string;
    email: string;
    passwordHash: string;
    code: string;
    expiresAt: Date;
  }) {
    return prisma.pendingRegistration.upsert({
      where: { email: data.email },
      create: {
        name: data.name,
        email: data.email,
        passwordHash: data.passwordHash,
        code: data.code,
        expiresAt: data.expiresAt,
      },
      update: {
        name: data.name,
        passwordHash: data.passwordHash,
        code: data.code,
        expiresAt: data.expiresAt,
      },
    });
  }

  /**
   * Find a pending registration by email.
   */
  async findPendingByEmail(email: string) {
    return prisma.pendingRegistration.findUnique({
      where: { email },
    });
  }

  /**
   * Find a valid pending registration matching email & 6-digit OTP code.
   */
  async findValidPendingRegistration(email: string, code: string) {
    return prisma.pendingRegistration.findFirst({
      where: {
        email,
        code,
        expiresAt: { gt: new Date() },
      },
    });
  }

  /**
   * Delete pending registration after user is successfully created in users table.
   */
  async deletePendingRegistration(email: string) {
    return prisma.pendingRegistration.deleteMany({
      where: { email },
    });
  }

  /**
   * Create fully verified user in users table.
   */
  async createVerifiedUser(data: {
    name: string;
    email: string;
    passwordHash: string;
    role?: Role;
  }) {
    return prisma.user.create({
      data: {
        name: data.name,
        email: data.email,
        passwordHash: data.passwordHash,
        role: data.role ?? Role.ATTENDEE,
        isVerified: true, // Marked verified immediately upon OTP confirmation
      },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        isVerified: true,
        createdAt: true,
      },
    });
  }
}


