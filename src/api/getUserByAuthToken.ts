import { Request } from 'express';
import * as auth from '@services/auth';
import { Middleware } from '@/api/interfaces';

/**
 * @todo 토큰 없을 때, 유효하지 않을 때 등 여러 경우에 따라 리턴값이 달라지도록?
 */
const getUserByAuthToken = async (req: Request): Promise<any> => {
  const authToken = req.headers.authorization;
  if (!authToken) return null;
  const [authType, jwt] = authToken.split(' ');
  const result = await auth.authToken.verify(jwt);
  const { password, ...user } = result;
  return user;
};

export default getUserByAuthToken;
