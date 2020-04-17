import JWT from '@utils/jwt';
import { getManager } from 'typeorm';
import { User } from '@models/user.model';

import OK from '@/api/Resolution';
import NO from '@/api/Rejection';

// import checkPassword from './checkPassword';
export interface Payload {
  id: number
}

const jwt = new JWT<Payload>(process.env.JWT_SECRET);

export const sign = async (user: User) => {
  const token = await jwt.sign({
    id: user.id,
  }, {
    expiresIn: '2days',
  });
  return token;
};

export const verify = async (token: string) => {
  const db = getManager();
  const payload = await jwt.verify(token);
  const { id } = payload;
  const user = await db.findOne(User, id);
  return user;
};

const validate = async (token: string): Promise<User> => {
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
