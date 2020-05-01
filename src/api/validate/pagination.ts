import L from 'lodash/fp';
import { array as curryArray, log } from '@utils/curry';
import * as expressValidator from 'express-validator';
import NO from '@/api/Rejection';
import { Middleware } from '@/api/interfaces';
import { respond } from '@/api/Controller';

const pagination = (max = 20) => {
  const validators = [
    expressValidator.query('desc').customSanitizer(value => {
      const desc = !!value;
      return desc;
    }),
    expressValidator.query('page').customSanitizer(value => {
      const page = value ? parseInt(value, 10) : 1;
      if (Number.isNaN(page)) throw new Error('Invalid query: page');
      return page;
    }),
    expressValidator.query('limit').customSanitizer(value => {
      const limit = value ? parseInt(value, 10) : max;
      if (Number.isNaN(limit)) throw new Error('Invalid query: limit');
      if (limit > max) throw new Error('Too big limit');
      return limit;
    }),
  ];
  return validators;
};

export default pagination;
