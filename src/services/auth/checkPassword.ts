import { getRepository } from 'typeorm';
import bcrypt from 'bcrypt';
import { User } from '@models/user.model';
import {
  response,
} from '@/api';

type UserInfo = {
  user?: User,
  id?: number,
  email?: string,
};

const getUserFromInfo = async (userInfo: UserInfo) => {
  if (userInfo.user) return userInfo.user;

  const repository = getRepository(User);

  if (userInfo.id) {
    return repository.findOne(userInfo.id);
  }

  if (userInfo.email) {
    return repository.findOne({
      email: userInfo.email,
    });
  }

  throw response.NO(404, '해당 유저가 없습니다.');
};

const checkUserPassword = async (
  userInfo: UserInfo,
  password: string,
) => {
  const user = await getUserFromInfo(userInfo);

  const result = await bcrypt.compare(password, user.password);

  if (!result) throw response.NO(401, '로그인 정보가 올바르지 않습니다.');

  return user;
};

export default checkUserPassword;
