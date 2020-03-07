import JWT from '@utils/jwt';
import { getRepository } from 'typeorm';
import { User } from '@models/user.model';
import checkPassword from './checkPassword';

const privateKey = process.env.JWT_SECRET;

const jwt = new JWT(privateKey, {
  expiresIn: '2days',
});

export const sign = async (user: User) => {
  const token = await jwt.sign({
    id: user.id,
  });

  return token;
};

export const verify = async (token: string) => {
  const payload: any = await jwt.verify(token);
  const { id } = payload;
  const repository = getRepository(User);
  const user = await repository.findOne(id);
  return user;
};

export default {
  sign,
  verify,
};
