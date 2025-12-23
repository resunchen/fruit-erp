import { Request, Response, NextFunction } from 'express';

export interface ApiError {
  code: number;
  message: string;
  status: number;
}

export class AppError extends Error implements ApiError {
  code: number;
  status: number;

  constructor(message: string, code: number = 500, status: number = 500) {
    super(message);
    this.code = code;
    this.status = status;
    Error.captureStackTrace(this, this.constructor);
  }
}

export const errorHandler = (
  err: Error | AppError,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (err instanceof AppError) {
    return res.status(err.status).json({
      code: err.code,
      data: null,
      message: err.message,
    });
  }

  console.error('Unexpected error:', err);

  return res.status(500).json({
    code: 500,
    data: null,
    message: 'Internal server error',
  });
};
