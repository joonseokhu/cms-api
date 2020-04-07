import { ResponseData } from '@/api/interfaces';

export class Resolution implements ResponseData {
  public status: boolean;

  public statusCode: number;

  public message: string;

  public data: any;

  constructor(data?: any) {
    this.status = true;
    this.statusCode = 200;
    this.message = 'success';
    this.data = data || null;
  }
}

const createResolution = (data: any): Resolution => new Resolution(data);

export default createResolution;
