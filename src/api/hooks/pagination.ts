import { Request } from 'express';
import { DocumentQuery, Document } from 'mongoose';

export type WithPagination = <T extends Document>(query: DocumentQuery<T[], T>) => (
  DocumentQuery<T[], T>
);

export default (req, max: number = 20) => {
  const page = (value => {
    const ret = value ? parseInt(value, 10) : 1;
    if (Number.isNaN(ret)) throw new Error('Invalid query: page');
    return ret;
  })(req.query.page as string);

  const limit = (value => {
    const ret = value ? parseInt(value, 10) : max;
    if (Number.isNaN(ret)) throw new Error('Invalid query: limit');
    if (ret > max) throw new Error('Too big limit');
    return ret;
  })(req.query.limit as string);

  const desc = (value => {
    const ret = !!value;
    return ret;
  })(req.query.desc as string);

  const sort = (value => {
    const ret = String(value) || '_id';
    return ret;
  })(req.query.sort as string);

  const withPagination: WithPagination = query => query
    .limit(limit)
    .skip(limit * (page - 1));

  return withPagination;
};
