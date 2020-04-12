import * as user from '../services/user.services';
import { Controller, validate } from '@/api';
import authorize from '@/api/authorize';

export const register = Controller([
  // authorize(
  //   authorize.isUser(true),
  // ),
  validate(
    validate.body('email').isEmail(),
    validate.body('username').isLength({ min: 4, max: 20 }),
    validate.body('password').isLength({ min: 8, max: 50 }),
  ),
], async (req, OK, NO) => {
  const data = req.body;
  const result = await user.createUser(data);
  return OK(result);
});

export const getUsers = Controller([
  authorize(
    authorize.hasAuth(false),
    authorize.and(
      authorize.hasAuth(false),
      authorize.hasAuth(true),
      authorize.and(
        authorize.hasAuth(true),
        authorize.hasAuth(false),
      ),
    ),
  ),
], async (req, OK, NO) => {
  const { query } = req;
  const result = await user.getUser(0, query);
  return OK(result);
});

export const getUser = Controller([
  validate(
    validate.param('id').isInt(),
  ),
], async (req, OK, NO) => {
  const userID = Number(req.params.id);
  const { query } = req;
  const result = await user.getUser(userID, query);
  return OK(result);
});

// export const login;

// export const resign;
