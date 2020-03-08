import {
  Request, Response, NextFunction, ErrorRequestHandler,
} from 'express';
import { Rejection, reject } from '@/api/errors/Rejection';

type MiddlewareInterface = (req: Request, res: Response, next?: NextFunction) => void;

export const Middleware = (middleware: MiddlewareInterface): MiddlewareInterface => async (req, res, next) => {
  try {
    middleware(req, res);
  } catch (err) {
    reject(res, new Rejection(err));
  }
};
