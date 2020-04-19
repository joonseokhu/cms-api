import L from 'lodash/fp';
import { array as curryArray, log } from '@utils/curry';
import * as expressValidator from 'express-validator';
import NO from '@/api/Rejection';
import { Middleware } from '@/api/interfaces';
import { respond } from '@/api/Controller';

type Validate = (...middlewares: Array<Middleware|Middleware[]>) => Middleware[];

const OptionalToArray = <T>(value: T|T[]): T[] => (
  Array.isArray(value) ? value : [value]
);

const findByString = (...allowedQueries: Array<string|string[]>) => {
  const allows = L.pipe(
    log(1),
    curryArray.map(e => OptionalToArray(e)),
    log(2),
    curryArray.map(e => JSON.stringify(e)),
    log(3),
  )(allowedQueries);

  const compareKeys = L.pipe(
    log(4),
    // curryArray.map(e => OptionalToArray(e)),
    OptionalToArray,
    log(5),
    curryArray.map(e => JSON.stringify(e)),
    log(6),
    curryArray.filter(e => allows.includes(e)),
    log(7),
  );

  return [
    expressValidator.query('findKey').custom((value, { req }) => {
      const findValue = req.query?.findValue || undefined;
      if (!value && !findValue) return true;
      if (!findValue) {
        throw new Error('use both query: [findKey, findValue]');
      }
      const validKeys = compareKeys(value);
      if (!validKeys.length) throw new Error('Invalid query: findKey');
      return true;
    }),
    expressValidator.query('findValue').custom((value, { req }) => {
      const findKey = req.query?.findKey || undefined;
      if (!value && !findKey) return true;
      if (!req.query.findKey) {
        throw new Error('use both query: [findKey, findValue]');
      }
      if (value.length < 2) {
        throw new Error('length of query findValue has to be more than 1');
      }
      return true;
    }),
  ];
};

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

export default Object.assign(validate, {
  ...expressValidator,
  findByString,
});
