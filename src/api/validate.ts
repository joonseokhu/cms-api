import * as EV from 'express-validator';
import NO from '@/api/Rejection';
import { Middleware } from '@/api/interfaces';
import { respond } from '@/api/Controller';

type Validate = (...middlewares: Middleware[]) => Middleware[];

// interface Validate {
//   (...middlewares: Middleware[]): Middleware[],

// }

const validate: Validate = (...middlewares) => {
  const handIn: Middleware = (req, res, next) => {
    const errors = EV.validationResult(req);
    if (!errors.isEmpty()) {
      return respond(
        res,
        NO(422, '요청 형식이 잘못되었습니다.', errors.array()),
      );
    }
    return next();
  };

  return [
    ...middlewares,
    handIn,
  ];
};

export default Object.assign(
  validate,
  EV,
);
