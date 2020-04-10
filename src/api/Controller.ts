import { Router, Response } from 'express';

import {
  ResponseData, Middleware, MainService, Controller,
} from '@/api/interfaces';

import OK from '@/api/Resolution';
import NO from '@/api/Rejection';

import getUserByAuthToken from '@/api/getUserByAuthToken';

export const respond = (res: Response, data: ResponseData) => res
  .status(data.statusCode)
  .json(data);

/**
 * @todo 이거 나중에 어디로 빼야겠다.
 * @todo 토큰체크 통과 못한 이유에 따라 다른 행동이 나타나도록. 특히 리프레싱 관련
 * @todo 토큰 통과했을때도 리프레싱 토큰 주는건 어떨지
 */
const checkToken: Middleware = async (req, res, next) => {
  try {
    const user = await getUserByAuthToken(req);
    req.user = user;
    next();
  } catch (err) {
    console.error('AUTH ERROR');
    console.error(err);
    respond(res, NO(err));
  }
};

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
  router.use(checkToken, ...pre, mainServiceWrapper);
  return router;
};
