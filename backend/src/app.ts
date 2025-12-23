import express from 'express';
import cors from 'cors';
import { errorHandler } from './utils/errors';
import { authMiddleware } from './middleware/auth.middleware';
import { authController } from './controllers/authController';
import authRoutes from './routes/auth.routes';

const app = express();

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors({
  origin: ['http://localhost:5173', 'http://localhost:5174', 'http://localhost:3000'],
  credentials: true,
}));

// Routes
app.use('/api/v1/auth', authRoutes);

// Protected routes
app.get('/api/v1/users/me', authMiddleware, authController.getMe);

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok' });
});

// Error handler (must be last)
app.use(errorHandler);

export default app;
