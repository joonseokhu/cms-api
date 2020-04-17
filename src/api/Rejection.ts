import { ResponseData } from '@/api/interfaces';

export class Rejection extends Error implements ResponseData {
  public status: boolean;

  public statusCode: number;

  public message: string;

  public data: any;

  constructor(error: number|Rejection|Error, message?: string, data?: any) {
    super();
    this.status = false;
    if (typeof error === 'number') {
      this.statusCode = error || 500;
      this.message = message || 'Uncaught Error';
      this.data = data || {};
      return;
    }

    if (error instanceof Rejection) {
      this.statusCode = error.statusCode || 500;
      this.message = error.message || 'Uncaught Error';
      this.data = error.data || {};
      return;
    }

    if (error instanceof Error) {
      this.statusCode = 500;
      this.message = error.message || 'Uncaught Error';
      this.data = error;
      return;
    }

    this.statusCode = 500;
    this.message = 'Uncaught Error';
    this.data = error;
  }
}

const createRejection = (
  error: number|Rejection|Error,
  message?: string,
  data?: any,
): Rejection => new Rejection(error, message, data);

export default createRejection;
