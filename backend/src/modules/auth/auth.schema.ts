import { z } from 'zod';

// ─────────────────────────────────────────────────────────────
// Register Schema
// ─────────────────────────────────────────────────────────────
export const RegisterSchema = z.object({
  name: z
    .string()
    .min(2, 'Nama minimal 2 karakter.')
    .max(100, 'Nama maksimal 100 karakter.')
    .trim(),

  email: z
    .string()
    .email('Format email tidak valid.')
    .toLowerCase()
    .trim(),

  password: z
    .string()
    .min(8, 'Password minimal 8 karakter.')
    .max(72, 'Password maksimal 72 karakter.')
    .refine((val) => /[A-Z]/.test(val), 'Password harus mengandung minimal 1 huruf kapital.')
    .refine((val) => /[a-z]/.test(val), 'Password harus mengandung minimal 1 huruf kecil.')
    .refine((val) => /[0-9]/.test(val), 'Password harus mengandung minimal 1 angka.')
    .refine((val) => /[\W_]/.test(val), 'Password harus mengandung minimal 1 karakter khusus (!, @, #, dll.).'),
});

// ─────────────────────────────────────────────────────────────
// Login Schema
// ─────────────────────────────────────────────────────────────
export const LoginSchema = z.object({
  email: z
    .string()
    .email('Format email tidak valid.')
    .toLowerCase()
    .trim(),

  password: z
    .string()
    .min(1, 'Password wajib diisi.'),
});

// ─────────────────────────────────────────────────────────────
// Refresh Token Schema
// ─────────────────────────────────────────────────────────────
export const RefreshTokenSchema = z.object({
  refreshToken: z
    .string()
    .min(1, 'Refresh token tidak boleh kosong.'),
});

// ─────────────────────────────────────────────────────────────
// Change Password Schema  (akan dipakai di fase berikutnya)
// ─────────────────────────────────────────────────────────────
export const ChangePasswordSchema = z
  .object({
    currentPassword: z
      .string()
      .min(1, 'Password saat ini wajib diisi.'),

    newPassword: z
      .string()
      .min(8, 'Password baru minimal 8 karakter.')
      .max(72, 'Password baru maksimal 72 karakter.')
      .refine((val) => /[A-Z]/.test(val), 'Password baru harus mengandung minimal 1 huruf kapital.')
      .refine((val) => /[a-z]/.test(val), 'Password baru harus mengandung minimal 1 huruf kecil.')
      .refine((val) => /[0-9]/.test(val), 'Password baru harus mengandung minimal 1 angka.')
      .refine((val) => /[\W_]/.test(val), 'Password baru harus mengandung minimal 1 karakter khusus.'),

    confirmPassword: z
      .string()
      .min(1, 'Konfirmasi password wajib diisi.'),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: 'Konfirmasi password tidak cocok dengan password baru.',
    path: ['confirmPassword'],
  })
  .refine((data) => data.currentPassword !== data.newPassword, {
    message: 'Password baru tidak boleh sama dengan password saat ini.',
    path: ['newPassword'],
  });

// ─────────────────────────────────────────────────────────────
// Verify Email Schema (6-Digit OTP)
// ─────────────────────────────────────────────────────────────
export const VerifyEmailSchema = z.object({
  email: z
    .string()
    .email('Format email tidak valid.')
    .toLowerCase()
    .trim(),

  code: z
    .string()
    .length(6, 'Kode OTP harus 6 digit angka.')
    .regex(/^\d{6}$/, 'Kode OTP hanya boleh berisi angka.'),
});

// ─────────────────────────────────────────────────────────────
// Resend Verification Email Schema
// ─────────────────────────────────────────────────────────────
export const ResendVerificationSchema = z.object({
  email: z
    .string()
    .email('Format email tidak valid.')
    .toLowerCase()
    .trim(),
});

// ─────────────────────────────────────────────────────────────
// Inferred TypeScript types from schemas
// ─────────────────────────────────────────────────────────────
export type RegisterInput = z.infer<typeof RegisterSchema>;
export type LoginInput = z.infer<typeof LoginSchema>;
export type RefreshTokenInput = z.infer<typeof RefreshTokenSchema>;
export type ChangePasswordInput = z.infer<typeof ChangePasswordSchema>;
export type VerifyEmailInput = z.infer<typeof VerifyEmailSchema>;
export type ResendVerificationInput = z.infer<typeof ResendVerificationSchema>;

