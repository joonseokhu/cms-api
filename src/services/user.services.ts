import { getRepository } from 'typeorm';
import bcrypt from 'bcrypt';
// import { sign, verify } from '@utils/jwt';
import { User } from '../models/user.model';

interface registerForm {
  email: string,
  username: string,
  password: string,
}

export const createUser = async (data: registerForm): Promise<any> => {
  const {
    email,
    username,
  } = data;

  const repository = getRepository(User);

  console.log({ email });

  const findResult = await repository.find({
    email,
  });

  console.log({ findResult });

  if (findResult.length) throw new Error('NOOO');

  const user = new User();
  const password = await bcrypt.hash(data.password, 10);

  user.email = email;
  user.username = username;
  user.password = password;

  return repository.save(user);
};
