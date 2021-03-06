import { getManager } from 'typeorm';
import bcrypt from 'bcrypt';
import { getRandomChars } from '@utils/random';
import {
  response,
} from '@/api';
// import { sign, verify } from '@utils/jwt';
import { useQuery } from '@utils/db';
import $User, { User, SafeUser } from '@/components/User/model';
import $UserProfile, { UserProfile } from './UserProfile.model';

interface RegisterForm {
  email: string,
  username: string,
  password: string,
}

export const createUser = async (data: RegisterForm): Promise<SafeUser> => {
  // const db = getManager();
  const {
    email,
    username,
  } = data;

  const findResult = await $User.findOne({
    email,
  });

  if (findResult) throw response.NO(403, '이미 등록된 이메일 주소입니다.');

  const password = await bcrypt.hash(data.password, 10);

  const profile = await $UserProfile.create({});

  const user = await $User.create({
    email,
    username,
    password,
    profile,
  });

  const { password: _, ...safeUser } = user;

  return safeUser as SafeUser;
};

export const getUser = async (_id: number, query: any): Promise<SafeUser|SafeUser[]> => {
  const {
    email,
    username,
    status,
    tags,
  } = query;

  if (_id) {
    const user = await $User.findById(_id);
    if (!user) throw response.NO(404, '찾을 수 없습니다.');
    return user;
  }

  const users = await $User.find(useQuery.optionals({
    email,
    username,
    status,
    tags,
  }), { password: false })
    .populate('profile');

  return users;
};
