import {
  Request, Response, NextFunction, ErrorRequestHandler,
} from 'express';

export class Rejection {
  public statusCode: number;

  public message: string;

  public data: any;

  constructor(error: number|Error, message?: string, data?: any) {
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

export const reject = (res: Response, rejection: Rejection) => res
  .status(rejection.statusCode)
  .json(rejection);
