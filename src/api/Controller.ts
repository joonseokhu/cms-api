import { Router, Response } from 'express';

import {
  ResponseData, Middleware, MainService, Controller,
} from '@/api/interfaces';

import OK from '@/api/Resolution';
import NO from '@/api/Rejection';

export const respond = (res: Response, data: ResponseData) => res
  .status(data.statusCode)
  .json(data);

export const controller: Controller = (pre, main) => {
  const mainServiceWrapper: Middleware = async (req, res, next) => {
    try {
      const result = await main(req, OK, NO, next);
      respond(res, result);
    } catch (err) {
      console.error(err);
      respond(res, NO(err));
    }
  };
  const router = Router();
  router.use(...pre, mainServiceWrapper);
  return router;
};
