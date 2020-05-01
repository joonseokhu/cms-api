import { Response, Request } from 'express';
import authToken from '@/components/User/authToken';
import { respond } from '@/api/response';
import {
  ResponseData, Middleware, MainService, Controller,
} from '@/api/interfaces';

/**
 * @todo 토큰체크 통과 못한 이유에 따라 다른 행동이 나타나도록. 특히 리프레싱 관련
 * @todo 토큰 통과했을때도 리프레싱 토큰 주는건 어떨지
 */

// declare namespace Express {
//   export interface Request {
//     user?: any;
//   }
// }

export const checkTokenAndSetUser: Middleware = async (req, res, next) => {
  try {
    const token = req.headers.authorization;
    const user = await authToken.validate(token);
    req.user = user;
    return next();
  } catch (err) {
    console.error('AUTH ERROR');
    console.error(err);
    return respond(res, err);
  }
};
