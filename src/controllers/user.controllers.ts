import { createUser } from '../services/user.services';
import { Middleware } from '@/api';

export const register = Middleware(async (req, Res, Rej) => {
  const data = req.body;
  const result = await createUser(data);
  return new Res(result);
});

// export const login;

// export const resign;
