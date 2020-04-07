import { getRepository } from 'typeorm';
import bcrypt from 'bcrypt';
import {
  response,
} from '@/api';
// import { sign, verify } from '@utils/jwt';
import { User } from '../models/user.model';

interface registerForm {
  email: string,
  username: string,
  password: string,
}

export const createUser = async (data: registerForm) => {
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

  if (findResult.length) throw response.NO(403, '이미 등록된 이메일 주소입니다.');

  const user = new User();
  const password = await bcrypt.hash(data.password, 10);

  user.email = email;
  user.username = username;
  user.password = password;

  return repository.save(user);
};
