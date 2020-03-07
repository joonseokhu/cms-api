import { Middleware } from '@/interfaces';
import { createUser } from '../services/user.services';

export const register: Middleware = async (req, res, next) => {
  try {
    const data = req.body;
    const result = await createUser(data);
    res.json(result);
  } catch (err) {
    next(err);
  }
};

// export const login;

// export const resign;
