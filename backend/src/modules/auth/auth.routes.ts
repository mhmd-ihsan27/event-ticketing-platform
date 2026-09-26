import { Router } from 'express';
import { AuthRepository } from './auth.repository.js';
import { AuthService } from './auth.service.js';
import { AuthController } from './auth.controller.js';
import { authenticateToken } from '../../infrastructure/middleware/auth.middleware.js';
import { validate } from '../../shared/middleware/validate.middleware.js';
import { RegisterSchema, LoginSchema, RefreshTokenSchema, VerifyEmailSchema, ResendVerificationSchema } from './auth.schema.js';

// ─────────────────────────────────────────────────────────────
// Dependency Injection — wire the 3 layers together
// ─────────────────────────────────────────────────────────────
const authRepository = new AuthRepository();
const authService = new AuthService(authRepository);
const authController = new AuthController(authService);

const router = Router();

// ─────────────────────────────────────────────────────────────
// Public Routes (no auth required)
// ─────────────────────────────────────────────────────────────

// validate() middleware runs BEFORE controller — rejects bad input early
router.post(
  '/register',
  validate(RegisterSchema),
  (req, res, next) => authController.register(req, res, next),
);

router.post(
  '/login',
  validate(LoginSchema),
  (req, res, next) => authController.login(req, res, next),
);

router.post(
  '/verify-email',
  validate(VerifyEmailSchema),
  (req, res, next) => authController.verifyEmail(req, res, next),
);

router.post(
  '/resend-verification',
  validate(ResendVerificationSchema),
  (req, res, next) => authController.resendVerification(req, res, next),
);

router.post(
  '/refresh',
  validate(RefreshTokenSchema),
  (req, res, next) => authController.refreshToken(req, res, next),
);


router.post(
  '/logout',
  (req, res, next) => authController.logout(req, res, next),
);

// ─────────────────────────────────────────────────────────────
// Protected Routes (JWT required)
// ─────────────────────────────────────────────────────────────
router.get(
  '/me',
  authenticateToken,
  (req, res, next) => authController.getProfile(req as any, res, next),
);

export default router;
