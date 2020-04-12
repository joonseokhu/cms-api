import { getManager } from 'typeorm';
import bcrypt from 'bcrypt';
import { User } from '@models/user.model';
import { response } from '@/api';

type UserInfo = {
  user?: User,
  id?: number,
  username?: string,
  email?: string,
};

const optionalFindQuery = (query: any): any => Object
  .entries(query)
  .reduce((acc, [key, value]) => (
    (value === undefined) ? acc : { ...acc, [key]: value }
  ), {});

const getUserFromInfo = async (data: UserInfo): Promise<User> => {
  const db = getManager();
  const { user, ...info } = data;
  if (user) return user;
  const result = await db.findOne(User, optionalFindQuery(info));
  if (!result) throw response.NO(404, '해당 유저가 없습니다.');
  return result;
};

interface checkUserPassword {
  (userInfo: UserInfo, password: string): Promise<any>
}
export const checkUserPassword: checkUserPassword = async (userInfo, password) => {
  const { password: hashedPassword, ...user } = await getUserFromInfo(userInfo);
  const result = await bcrypt.compare(password, hashedPassword);
  if (!result) throw response.NO(401, '로그인 정보가 올바르지 않습니다.');
  return user;
};
