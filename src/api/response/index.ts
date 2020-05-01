import { Response } from 'express';
import { ResponseData } from '@/api/interfaces';
import OK, { Resolution } from './Resolution';
import NO, { Rejection } from './Rejection';

const respond = (res: Response, data: ResponseData) => res
  .status(data.statusCode)
  .json(data);

export default {
  OK, NO,
};

export {
  OK, NO, Rejection, Resolution, respond,
};
