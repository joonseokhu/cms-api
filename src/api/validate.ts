import {
  check,
  validationResult,
  param,
  body,
  query,
} from 'express-validator';

// import { response, respond } from '@/api';

import NO from '@/api/Rejection';

import { Middleware } from '@/api/interfaces';
import { respond } from '@/api/Controller';

type Validator = (functions: object) => Middleware[];

export const validate = (cb: Validator): Middleware[] => {
  const configs = cb({
    check,
    param,
    body,
    query,
  });

  const handIn: Middleware = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      respond(
        res,
        NO(422, '요청 형식이 잘못되었습니다.', errors.array()),
      );
    }
    next();
  };

  return [
    ...configs,
    handIn,
  ];
};

export default validate;

export {
  check,
  param,
  body,
  query,
};
