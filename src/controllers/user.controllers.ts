import { createUser } from '../services/user.services';
import { Controller } from '@/api';

export const register = Controller([], async (req, Res, Rej) => {
  const data = req.body;
  const result = await createUser(data);
  return new Res(result);
});

// export const login;

// export const resign;
