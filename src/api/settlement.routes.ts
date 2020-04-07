import {
  Router, Request, Response, NextFunction, ErrorRequestHandler,
} from 'express';

import {
  respond, response,
} from '@/api';

const router = Router();

router.use((req, res, next) => respond(res, response.NO(400, '잘못된 URL 입니다.', {
  method: req.method,
  url: req.originalUrl,
})));

router.use((
  err: any,
  req: Request,
  res: Response,
  next: NextFunction,
) => respond(res, response.NO(err.status, err.message, err)));

export default router;
