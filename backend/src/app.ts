import express, { Request, Response } from 'express';
import authRoutes from './modules/auth/auth.routes.js';

const app = express();

app.use(express.json());

// Root Health / Info Endpoint
app.get('/', (req: Request, res: Response) => {
  res.json({
    success: true,
    message: 'API Manajemen Event & Tiket Digital Siap Digunakan.',
    timestamp: new Date().toISOString(),
  });
});

// API v1 Routes
app.use('/api/v1/auth', authRoutes);

export default app;
