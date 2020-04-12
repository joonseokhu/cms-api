import { Response, Request } from 'express';
import authToken from '@services/auth/authToken';
import {
  ResponseData, Middleware, MainService, Controller, SafeUser,
} from '@/api/interfaces';

import OK from '@/api/Resolution';
import NO from '@/api/Rejection';

const respond = (res: Response, data: ResponseData) => res
  .status(data.statusCode)
  .json(data);

/**
 * @todo 토큰체크 통과 못한 이유에 따라 다른 행동이 나타나도록. 특히 리프레싱 관련
 * @todo 토큰 통과했을때도 리프레싱 토큰 주는건 어떨지
 */

// declare namespace Express {
//   export interface Request {
//     user?: any;
//   }
// }

// export const checkToken = async (req: Request): Promise<SafeUser> => {
//   const token = req.headers.authorization;
//   if (!token) return null;
//   const [authType, jwt] = token.split(' ');
//   const user = await authToken.verify(jwt);
//   const { password, ...safeUser } = user;
//   return safeUser;
// };

export const checkTokenAndSetUser: Middleware = async (req, res, next) => {
  try {
    const token = req.headers.authorization;
    if (!token) return next();
    const [authType, jwt] = token.split(' ');
    const user = await authToken.verify(jwt);
    const { password, ...safeUser } = user;
    req.user = safeUser || null;
    return next();
  } catch (err) {
    console.error('AUTH ERROR');
    console.error(err);
    return respond(res, NO(err));
  }
};
