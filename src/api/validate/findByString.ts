import L from 'lodash/fp';
import { array as curryArray, log } from '@utils/curry';
import * as expressValidator from 'express-validator';
import NO from '@/api/Rejection';
import { Middleware } from '@/api/interfaces';
import { respond } from '@/api/Controller';

const OptionalToArray = <T>(value: T|T[]): T[] => (
  Array.isArray(value) ? value : [value]
);

const findByString = (...allowedQueries: Array<string|string[]>) => {
  const normalize = L.pipe(
    OptionalToArray,
    curryArray.sort(),
    value => JSON.stringify(value),
  );

  const allows = L.pipe(
    curryArray.map(normalize),
    curryArray.sort(),
  )(allowedQueries);

  const compareKeys = L.pipe(
    normalize,
    e => allows.includes(e),
  );

  return [
    expressValidator.query('findKey').custom((findKey, { req }) => {
      const findValue = req.query?.findValue || undefined;
      if (!findKey && !findValue) return true;
      const validKeys = compareKeys(findKey);
      if (!validKeys) throw new Error('Invalid query: findKey');
      return true;
    }),
    expressValidator.query('findValue').custom((findValue, { req }) => {
      const findKey = req.query?.findKey || undefined;
      if (!findValue) return true;
      if (!findKey) throw new Error('use both query: [findKey, findValue]');
      if (findValue.length < 2) {
        throw new Error('length of query findValue has to be more than 1');
      }
      return true;
    }),
  ];
};

export default findByString;
