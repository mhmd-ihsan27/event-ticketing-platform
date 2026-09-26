import express, { Router } from 'express';
import swaggerUi from 'swagger-ui-express';
import swaggerJsDoc from 'swagger-jsdoc';
import { applyGateway } from './gateway/api.gateway.js';
import { swaggerOptions } from './config/swagger.config.js';
import authRoutes from './modules/auth/auth.routes.js';

const app = express();

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// Swagger UI — API Documentation
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
const swaggerSpec = swaggerJsDoc(swaggerOptions);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec, {
  customSiteTitle: 'API Event & Tiket Digital Docs',
}));
app.get('/api-docs.json', (req, res) => {
  res.setHeader('Content-Type', 'application/json');
  res.send(swaggerSpec);
});

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// Main API Router
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
const router = Router();

// Register module routes here
router.use('/auth', authRoutes);

// Root info endpoint
router.get('/', (req, res) => {
  res.json({
    success: true,
    message: 'API Manajemen Event & Tiket Digital Siap Digunakan.',
    docs: '/api-docs',
    health: '/health',
    version: 'v1',
    timestamp: new Date().toISOString(),
  });
});

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// Apply API Gateway (middleware + routes)
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
applyGateway(app, router);

export default app;
