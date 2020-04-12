import { getManager } from 'typeorm';
import bcrypt from 'bcrypt';
import { getRandomChars } from '@utils/random';
import {
  response,
} from '@/api';
// import { sign, verify } from '@utils/jwt';
import { User } from '../models/user.model';
import { UserProfile } from '../models/userProfile.model';

interface RegisterForm {
  email: string,
  username: string,
  password: string,
}

/**
 * @todo 이거 나중에 모듈로 빼자
 */
const optionalFindQuery = (query: any): any => Object
  .entries(query)
  .reduce((acc, [key, value]) => (
    (value === undefined) ? acc : { ...acc, [key]: value }
  ), {});

export const createUser = async (data: RegisterForm) => {
  const db = getManager();
  const {
    email,
    username,
  } = data;

  const findResult = await db.find(User, {
    email,
  });

  if (findResult.length) throw response.NO(403, '이미 등록된 이메일 주소입니다.');

  const user = new User();
  const password = await bcrypt.hash(data.password, 10);

  const profile = new UserProfile();
  await db.save(profile);

  user.email = email;
  user.username = username;
  user.password = password;
  user.profile = profile;

  const result = await db.save(user);

  return result;
};

export const getUser = async (id: number, query: any) => {
  const db = getManager();
  const {
    email,
    username,
    status,
    tags,
  } = query;

  const sanitizeUser = (user: User) => {
    const { password, ...result } = user;
    return result;
  };

  if (id) {
    const user = await db.findOne(User, {
      where: { id },
      relations: ['profile'],
    });
    if (!user) return response.NO(404, '찾을 수 없습니다.');
    return sanitizeUser(user);
  }

  const users = await db.find(User, {
    where: optionalFindQuery({
      email,
      username,
      status,
      tags,
    }),
    relations: ['profile'],
  });
  return users.map(sanitizeUser);
};
