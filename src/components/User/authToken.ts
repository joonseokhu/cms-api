import JWT from '@utils/jwt';
import { getManager } from 'typeorm';
import $User, { User, SafeUser } from '@/components/User/model';

import OK from '@/api/response/Resolution';
import { NO } from '@/api/response';

// import checkPassword from './checkPassword';
export interface Payload {
  id: number
}

const jwt = new JWT<Payload>(process.env.JWT_SECRET);

export const sign = async (user: User|SafeUser) => {
  const token = await jwt.sign({
    id: user.id,
  }, {
    expiresIn: '2days',
  });
  return token;
};

export const verify = async (token: string): Promise<SafeUser> => {
  // const db = getManager();
  const payload = await jwt.verify(token);
  const { id } = payload;
  const user = await $User.findById(id, { password: false });
  return user;
};

const validate = async (token: string): Promise<SafeUser> => {
  try {
    if (!token) return null;
    const [authType, authToken] = token.split(' ');
    if (authType !== 'Bearer') throw NO(401, 'Invalid authorization header prefix');
    const user = await verify(authToken);
    return user;
  } catch (err) {
    throw NO(401, 'Invalid auth Token', err);
  }
};

export default {
  sign,
  verify,
  validate,
};
