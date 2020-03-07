import { getRepository } from 'typeorm';
import bcrypt from 'bcrypt';
import { User } from '@models/user.model';

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

  throw new Error('404');
};

const checkUserPassword = async (
  userInfo: UserInfo,
  password: string,
) => {
  const user = await getUserFromInfo(userInfo);

  const result = await bcrypt.compare(password, user.password);

  if (!result) throw new Error('401');

  return user;
};

export default checkUserPassword;
