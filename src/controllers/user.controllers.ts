import { createUser } from '../services/user.services';
import { Controller, validate } from '@/api';
import authorize from '@/api/authorize';

export const register = Controller([
  authorize(
    // authorize.include(),
    // authorize.exclude(),
  ),
  validate(
    validate.body('email').isEmail(),
    validate.body('username').isLength({ min: 2, max: 8 }),
    validate.body('password').isLength({ min: 8, max: 50 }),
  ),
], async (req, OK, NO) => {
  const data = req.body;
  const result = await createUser(data);
  return OK(result);
});

// export const login;

// export const resign;
