import { Request, Response, NextFunction } from 'express';
import { verifyToken, JwtPayload } from '../utils/jwt';
import { AppError } from '../utils/errors';

declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace Express {
    interface Request {
      user?: JwtPayload;
      userId?: string;
    }
  }
}

export const authMiddleware = (req: Request, res: Response, next: NextFunction) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw new AppError('Missing or invalid authorization header', 401, 401);
    }

    const token = authHeader.substring(7);
    const decoded = verifyToken(token);

    req.user = decoded;
    req.userId = decoded.userId; // Set userId from JWT payload
    next();
  } catch (error) {
    if (error instanceof AppError) {
      return res.status(error.status).json({
        code: error.code,
        data: null,
        message: error.message,
      });
    }

    return res.status(401).json({
      code: 401,
      data: null,
      message: 'Invalid or expired token',
    });
  }
};
