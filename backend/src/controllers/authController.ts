import { Request, Response, NextFunction } from 'express';
import { authService } from '../services/authService';
import { AppError } from '../utils/errors';

export const authController = {
  async register(req: Request, res: Response, next: NextFunction) {
    try {
      const { email, password, name } = req.body;

      if (!email || !password || !name) {
        throw new AppError('Missing required fields', 400, 400);
      }

      const { user, token } = await authService.register(email, password, name);

      return res.status(201).json({
        code: 201,
        data: { user, token },
        message: 'User registered successfully',
      });
    } catch (error) {
      next(error);
    }
  },

  async login(req: Request, res: Response, next: NextFunction) {
    try {
      const { email, password } = req.body;

      if (!email || !password) {
        throw new AppError('Missing email or password', 400, 400);
      }

      const { user, token } = await authService.login(email, password);

      return res.json({
        code: 200,
        data: { user, token },
        message: 'Login successful',
      });
    } catch (error) {
      next(error);
    }
  },

  async logout(req: Request, res: Response, next: NextFunction) {
    try {
      return res.json({
        code: 200,
        data: null,
        message: 'Logout successful',
      });
    } catch (error) {
      next(error);
    }
  },

  async getMe(req: Request, res: Response, next: NextFunction) {
    try {
      if (!req.user) {
        throw new AppError('User not authenticated', 401, 401);
      }

      const user = await authService.getUser(req.user.userId);

      return res.json({
        code: 200,
        data: { user },
        message: 'User fetched successfully',
      });
    } catch (error) {
      next(error);
    }
  },
};
