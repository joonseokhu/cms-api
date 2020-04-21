import L from 'lodash/fp';
import { array as curryArray, log } from '@utils/curry';
import * as expressValidator from 'express-validator';
import NO from '@/api/Rejection';
import { Middleware } from '@/api/interfaces';
import { respond } from '@/api/Controller';

type Validate = (...middlewares: Array<Middleware|Middleware[]>) => Middleware[];

const validate: Validate = (...middlewares) => {
  const handIn: Middleware = (req, res, next) => {
    const errors = expressValidator.validationResult(req);
    if (!errors.isEmpty()) {
      return respond(
        res,
        NO(422, '요청 형식이 잘못되었습니다.', errors.array()),
      );
    }
    return next();
  };

  return [
    ...middlewares.flat(2),
    handIn,
  ];
};

export default validate;
