/* eslint-disable max-len */
/* eslint-disable max-classes-per-file */
import {
  Request, Response, NextFunction, ErrorRequestHandler,
} from 'express';

import { ResponseData } from '@/api/interfaces';

export class Rejection implements ResponseData {
  public status: boolean;

  public statusCode: number;

  public message: string;

  public data: any;

  constructor(error: number|Error, message?: string, data?: any) {
    this.status = false;
    if (typeof error === 'number') {
      this.statusCode = error || 500;
      this.message = message || 'Uncaught Error';
      this.data = data || {};
    } else {
      this.statusCode = 500;
      this.message = error.message || 'Uncaught Error';
      this.data = error;
    }
  }
}

export class Resolution implements ResponseData {
  public status: boolean;

  public statusCode: number;

  public message: string;

  public data: any;

  constructor(data?: any) {
    this.status = true;
    this.statusCode = 200;
    this.message = 'success';
    this.data = data || null;
  }
}

type MiddlewareInterface = (req: Request, res: Response, next?: NextFunction) => void;

type MiddlewareProxy = (request: Request, Res: any, Rej: any) => Promise<ResponseData>;

export const response = (res: Response, data: ResponseData) => res
  .status(data.statusCode)
  .json(data);

export const Middleware = (middleware: MiddlewareProxy): MiddlewareInterface => async (req, res, next) => {
  try {
    const result = await middleware(req, Resolution, Rejection);
    response(res, result);
  } catch (err) {
    response(res, new Rejection(err));
  }
};
