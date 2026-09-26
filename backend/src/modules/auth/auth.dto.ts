import { Role } from '@prisma/client';

// ─────────────────────────────────────────────────────────────
// INPUT DTOs — Data yang diterima dari Request
// ─────────────────────────────────────────────────────────────

export interface RegisterDTO {
  name: string;
  email: string;
  password: string;
}

export interface LoginDTO {
  email: string;
  password: string;
}

export interface RefreshTokenDTO {
  refreshToken: string;
}

export interface LogoutDTO {
  refreshToken: string;
}

// ─────────────────────────────────────────────────────────────
// OUTPUT DTOs — Data yang dikembalikan ke Controller / Client
// ─────────────────────────────────────────────────────────────

/** User profile shape (tanpa password) */
export interface UserProfileDTO {
  id: string;
  name: string;
  email: string;
  role: Role;
  isVerified: boolean;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

/** Tokens returned after login / refresh */
export interface AuthTokensDTO {
  accessToken: string;
  refreshToken: string;
  expiresIn: string;
}

/** Result returned by login operation */
export interface LoginResultDTO {
  tokens: AuthTokensDTO;
  user: Pick<UserProfileDTO, 'id' | 'name' | 'email' | 'role'>;
}

/** Result returned by refresh-token operation */
export interface RefreshResultDTO {
  accessToken: string;
  expiresIn: string;
}

/** Minimal user data returned after successful register */
export interface RegisterResultDTO {
  id: string;
  name: string;
  email: string;
  role: Role;
  isVerified: boolean;
  createdAt: Date;
}

/** Result returned after initiating registration before OTP verification */
export interface PendingRegisterResultDTO {
  message: string;
  email: string;
}

