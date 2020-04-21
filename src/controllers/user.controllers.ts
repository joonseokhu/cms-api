import { Controller, validate, authorize } from '@/api';
import authToken from '@services/auth/authToken';
import { SafeUser } from '@/api/interfaces';
import * as userService from '../services/user.services';

export const register = Controller([
  authorize(
    authorize.hasAuth(false),
  ),
  validate(
    validate.body('email').isEmail(),
    validate.body('username').isLength({ min: 4, max: 20 }),
    validate.body('password').isLength({ min: 8, max: 50 }),
  ),
], async (req, OK, NO) => {
  const data = req.body;
  const user = await userService.createUser(data);
  const token = await authToken.sign(user as SafeUser);
  return OK({
    token,
    user,
  });
});

export const getUsers = Controller([
  authorize(
    authorize.hasAuth(true),
  ),
], async (req, OK, NO) => {
  const { query } = req;
  const result = await userService.getUser(0, query);
  return OK(result);
});

export const getUser = Controller([
  validate(
    validate.param('id').isInt(),
  ),
], async (req, OK, NO) => {
  const userID = Number(req.params.id);
  const { query } = req;
  const result = await userService.getUser(userID, query);
  return OK(result);
});

// export const login;

// export const resign;
