import {
  Router, Request, Response, NextFunction, ErrorRequestHandler,
} from 'express';

import {
  Rejection, Resolution, response, Middleware,
} from '@/api';

const router = Router();

router.use((req, res, next) => response(res, new Rejection(400, '잘못된 URL 입니다.', {
  method: req.method,
  url: req.originalUrl,
})));

router.use((
  err: any,
  req: Request,
  res: Response,
  next: NextFunction,
) => response(res, new Rejection(err.status, err.message, err)));

export default router;
