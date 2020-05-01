import { getManager, getRepository } from 'typeorm';
import bcrypt from 'bcrypt';
import $User, { User } from '@/components/User/User.model';
import { response, Controller } from '@/api';

type UserInfo = {
  user?: User,
  id?: number,
  username?: string,
  email?: string,
};

const optionals = (query: any): any => Object
  .entries(query)
  .reduce((acc, [key, value]) => (
    (value === undefined) ? acc : { ...acc, [key]: value }
  ), {});

const getUserFromInfo = async (data: UserInfo): Promise<User> => {
  const { user, ...info } = data;
  if (user) return user;
  const result = await $User.findOne(optionals(info));
  if (!result) throw response.NO(404, 'No user(s) found');
  return result;
};

interface checkUserPassword {
  (userInfo: UserInfo, password: string): Promise<User>
}
export const checkUserPassword: checkUserPassword = async (userInfo, password) => {
  const user = await getUserFromInfo(userInfo).catch(err => {
    console.error(err);
    throw response.NO(401, 'Wrong log-in information');
  });

  const authInfo = await $User.findById(user._id);

  const result = await bcrypt.compare(password, authInfo.password);
  if (!result) throw response.NO(401, 'Wrong log-in information');
  return user;
};
