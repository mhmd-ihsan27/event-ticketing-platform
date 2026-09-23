import express, { Request, Response } from 'express';

const app = express();

app.use(express.json());

// Hello World Test Endpoint
app.get('/', (req: Request, res: Response) => {
  res.json({
    success: true,
    message: 'Hello World! API Manajemen Event & Tiket Digital Siap Digunakan.',
    timestamp: new Date().toISOString()
  });
});

export default app;
