/* eslint-disable max-len */

import {
  Request, Response, NextFunction, ErrorRequestHandler, Router,
} from 'express';

export interface ResponseData {
  status: boolean,
  statusCode: number,
  message: string,
  data: any,
}

export type Middleware = (req: Request, res: Response, next?: NextFunction) => any;

export type MainService = (request: Request, OK: any, NO: any, next?: NextFunction) => Promise<ResponseData>;

export type Controller = (
  preServices: Array<Middleware|Middleware[]>,
  mainService: MainService,
) => Router;

// Array<Middleware|Middleware[]>;
