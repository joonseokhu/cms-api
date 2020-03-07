import { getRepository } from 'typeorm';
import bcrypt from 'bcrypt';
import { User } from '@models/user.model';

interface loginForm {
  email: string,
  password: string,
}

export default async (data: loginForm): Promise<any> => {
  const {
    email,
    password,
  } = data;

  const repository = getRepository(User);

  const {
    password: hashedPassword,
    ...user
  } = await repository.findOne({
    email,
  });

  const result = await bcrypt.compare(password, hashedPassword);

  if (!result) throw new Error('틀림~');

  return user;
};
