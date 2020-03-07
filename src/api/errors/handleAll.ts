import {
  Request, Response, NextFunction, ErrorRequestHandler,
} from 'express';

export default (
  err: any,
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const status = err.status || 500;

  res.status(status || 500).json({
    message: err.message || 'unknown error',
    data: err.data || {},
  });
};
