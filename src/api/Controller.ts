import { Router, Request, Response } from 'express';
import {
  ResponseData, Middleware, Controller,
} from '@/api/interfaces';

import { checkTokenAndSetUser } from '@/api/checkAuthHeaders';

import OK from '@/api/Resolution';
import NO from '@/api/Rejection';


export const respond = (res: Response, data: ResponseData) => res
  .status(data.statusCode)
  .json(data);

// export const controller: Controller = (pre, main) => {
//   console.log()
//   return async (req, res, next) => {
//     try {
//       const user = await checkToken(req);
//       const result = await main({
//         req, OK, NO, next, user,
//       });
//       respond(res, result);
//     } catch (err) {
//       console.error(err);
//       respond(res, NO(err));
//     }
//   };
// };

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
