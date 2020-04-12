/* eslint-disable max-len */

import {
  Request, Response, NextFunction, ErrorRequestHandler, Router,
} from 'express';

import { User } from '@/models/user.model';

export interface ResponseData {
  status: boolean,
  statusCode: number,
  message: string,
  data: any,
}

export type SafeUser = Omit<User, 'password'>;

export interface ExtendedRequest extends Request {
  user?: SafeUser;
}

export type Middleware = (req: ExtendedRequest, res: Response, next?: NextFunction) => void;

// interface MainServiceParam {
//   req: ExtendedRequest;
//   OK: any;
//   NO: any;
//   next: NextFunction;
//   user: SafeUser;
// }

export type MainService = (request: ExtendedRequest, OK: any, NO: any, next?: NextFunction) => Promise<ResponseData>;
// export type MainService = (params: MainServiceParam) => Promise<ResponseData>;

// export type Controller = (
//   preServices: Array<Middleware|Middleware[]>,
//   mainService: MainService,
// ) => Middleware;

export type Controller = (
  preServices: Array<Middleware|Middleware[]>,
  mainService: MainService,
) => Router;

// Array<Middleware|Middleware[]>;
