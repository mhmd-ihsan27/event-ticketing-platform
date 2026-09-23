import { Role } from '@prisma/client';
import { prisma } from '../../infrastructure/database/prisma.client.js';
import { hashPassword, comparePassword } from '../../shared/utils/password.util.js';
import { generateAccessToken, generateRefreshToken, verifyRefreshToken } from '../../shared/utils/jwt.util.js';

export class AuthService {
  /**
   * Register new user (Default role: ATTENDEE)
   */
  async register(data: { name: string; email: string; password: string }) {
    const existingUser = await prisma.user.findUnique({
      where: { email: data.email },
    });

    if (existingUser) {
      throw new Error('EMAIL_EXISTS');
    }

    const passwordHash = await hashPassword(data.password);

    const user = await prisma.user.create({
      data: {
        name: data.name,
        email: data.email,
        passwordHash,
        role: Role.ATTENDEE, // Default register = ATTENDEE (user reguler)
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

    return user;
  }

  /**
   * Login user & emit tokens
   */
  async login(data: { email: string; password: string }) {
    const user = await prisma.user.findUnique({
      where: { email: data.email },
    });

    if (!user) {
      throw new Error('INVALID_CREDENTIALS');
    }

    if (!user.isActive) {
      throw new Error('ACCOUNT_INACTIVE');
    }

    const isPasswordValid = await comparePassword(data.password, user.passwordHash);
    if (!isPasswordValid) {
      throw new Error('INVALID_CREDENTIALS');
    }

    const payload = { userId: user.id, email: user.email, role: user.role };
    const accessToken = generateAccessToken(payload);
    const refreshToken = generateRefreshToken(payload);

    // Store refresh token in database (7 days expiration)
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 7);

    await prisma.refreshToken.create({
      data: {
        userId: user.id,
        token: refreshToken,
        expiresAt,
      },
    });

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

  /**
   * Get Current User Profile by ID
   */
  async getProfile(userId: string) {
    const user = await prisma.user.findUnique({
      where: { id: userId },
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

    if (!user) {
      throw new Error('USER_NOT_FOUND');
    }

    return user;
  }

  /**
   * Refresh Access Token using Refresh Token
   */
  async refreshAccessToken(token: string) {
    try {
      const decoded = verifyRefreshToken(token);

      const storedToken = await prisma.refreshToken.findUnique({
        where: { token },
      });

      if (!storedToken || storedToken.isRevoked || storedToken.expiresAt < new Date()) {
        throw new Error('INVALID_REFRESH_TOKEN');
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
    } catch (err) {
      throw new Error('INVALID_REFRESH_TOKEN');
    }
  }

  /**
   * Logout user by revoking Refresh Token
   */
  async logout(token: string) {
    await prisma.refreshToken.updateMany({
      where: { token },
      data: { isRevoked: true },
    });

    return true;
  }
}
