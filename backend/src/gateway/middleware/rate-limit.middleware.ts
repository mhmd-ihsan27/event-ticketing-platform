import rateLimit from 'express-rate-limit';

/**
 * Global Rate Limiter — applies to all routes.
 *
 * Limits: 100 requests per 15 minutes per IP.
 * Purpose: Prevent general abuse and DDoS attacks.
 */
export const globalRateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100,
  standardHeaders: true,  // Return rate limit info in the `RateLimit-*` headers
  legacyHeaders: false,   // Disable the `X-RateLimit-*` headers
  message: {
    success: false,
    message: 'Terlalu banyak permintaan dari IP ini. Coba lagi setelah 15 menit.',
  },
  skip: () => process.env.NODE_ENV === 'test', // Skip rate limiting during tests
});

/**
 * Auth Rate Limiter — strict limit for authentication endpoints.
 *
 * Limits: 20 requests per 15 minutes per IP.
 * Purpose: Prevent brute-force attacks on login and register endpoints.
 */
export const authRateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 20,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    message: 'Terlalu banyak percobaan autentikasi. Silakan tunggu 15 menit sebelum mencoba kembali.',
  },
  skip: () => process.env.NODE_ENV === 'test',
});
