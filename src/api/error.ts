import { Request, Response } from 'express';
import { ErrorData, ResponseData } from '@/api/interfaces';

const ErrorResponse = (statusCode: number, props: ErrorData) => {
  const sendErrorResponse = (res: Response): void => {
    res.status(statusCode).json({
      status: false,
      data: props,
    });
  };
  return sendErrorResponse;
};

export const NotFound = ErrorResponse(404, {

});
