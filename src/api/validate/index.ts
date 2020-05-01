import * as expressValidator from 'express-validator';
import validate from './validate';
import findByString from './findByString';
import pagination from './pagination';

export default Object.assign(validate, {
  ...expressValidator,
  findByString,
  pagination,
});
