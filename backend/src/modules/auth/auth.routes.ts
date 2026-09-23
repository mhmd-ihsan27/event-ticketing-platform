import { Router } from 'express';
import { AuthController } from './auth.controller.js';
import { authenticateToken } from '../../infrastructure/middleware/auth.middleware.js';

const router = Router();
const authController = new AuthController();

// Public Auth Routes
router.post('/register', (req, res) => authController.register(req, res));
router.post('/login', (req, res) => authController.login(req, res));
router.post('/refresh', (req, res) => authController.refreshToken(req, res));
router.post('/logout', (req, res) => authController.logout(req, res));

// Protected Profile Route
router.get('/me', authenticateToken, (req, res) => authController.getProfile(req, res));

export default router;
