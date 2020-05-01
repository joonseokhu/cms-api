import { Router, Request, Response } from 'express';
import {
  ResponseData, Middleware, Controller,
} from '@/api/interfaces';

import { checkTokenAndSetUser } from '@/api/checkAuthHeaders';

import { OK, NO, respond } from '@/api/response';

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
  const router = Router({ mergeParams: true });
  router.use(checkTokenAndSetUser, ...pre, mainServiceWrapper);
  return router;
};
