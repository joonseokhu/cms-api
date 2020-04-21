import * as expressValidator from 'express-validator';
import validate from './validate';
import findByString from './findByString';

export default Object.assign(validate, {
  ...expressValidator,
  findByString,
});
