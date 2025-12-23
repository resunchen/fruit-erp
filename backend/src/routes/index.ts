import { Router } from 'express';
import authRoutes from './auth.routes';

const router = Router();

router.use('/api/v1/auth', authRoutes);

// User routes
router.get('/api/v1/users/me', (req, res) => {
  // This will be handled by authController.getMe
  res.json({ code: 200, data: null, message: 'OK' });
});

export default router;
