import {
  Request, Response, NextFunction, ErrorRequestHandler,
} from 'express';

import { Middleware } from '@/interfaces';

import { Rejection, reject } from './Rejection';

export const fallback: Middleware = (req, res, next) => reject(res, new Rejection(400, '잘못된 URL 입니다.', {
  method: req.method,
  url: req.originalUrl,
}));

export const handleAll = (
  err: any,
  req: Request,
  res: Response,
  next: NextFunction,
) => reject(res, new Rejection(err.status, err.message, err));
