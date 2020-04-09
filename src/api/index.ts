// import {
//   Request, Response, NextFunction, ErrorRequestHandler,
// } from 'express';

// import { ResponseData, Middleware, MainService } from '@/api/interfaces';

import OK from '@/api/Resolution';
import NO from '@/api/Rejection';

import {
  controller as Controller,
  respond,
} from '@/api/Controller';

import validate from '@/api/validate';

const response = {
  OK,
  NO,
};

export {
  respond,
  response,
  Controller,
  validate,
};
