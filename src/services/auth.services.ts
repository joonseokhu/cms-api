import { getManager, getRepository } from 'typeorm';
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
  if (!result) throw response.NO(404, 'No user(s) found');
  return result;
};

interface checkUserPassword {
  (userInfo: UserInfo, password: string): Promise<any>
}
export const checkUserPassword: checkUserPassword = async (userInfo, password) => {
  const db = getManager();
  const user = await getUserFromInfo(userInfo).catch(err => {
    console.error(err);
    throw response.NO(401, 'Wrong log-in information');
  });

  const authInfo = await db
    .createQueryBuilder(User, 'user')
    .where('user.id = :id', { id: user.id })
    .select('user.id')
    .addSelect('user.password')
    .getOne();

  const result = await bcrypt.compare(password, authInfo.password);
  if (!result) throw response.NO(401, 'Wrong log-in information');
  return user;
};
