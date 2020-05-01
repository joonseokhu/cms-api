// import {
//   Request, Response, NextFunction, ErrorRequestHandler,
// } from 'express';

// import { ResponseData, Middleware, MainService } from '@/api/interfaces';

import response, { OK, NO, respond } from '@/api/response';

import {
  controller as Controller,
} from '@/api/Controller';

import validate from '@/api/validate';

import authorize from '@/api/authorize';

export {
  OK,
  NO,
  respond,
  response,
  Controller,
  validate,
  authorize,
};
