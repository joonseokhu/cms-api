import * as auth from '@services/auth';
import {
  Controller,
  response,
} from '@/api';

export const login = Controller([], async (req, OK, NO) => {
  const {
    email,
    password,
  } = req.body;

  const user = await auth.checkPassword({ email }, password);

  const token = await auth.authToken.sign(user);

  return response.OK({
    token,
  });
});

export const checkToken = Controller([], async (req, Res, Rej) => {
  const [authType, token] = req.headers.authorization.split(' ');
  const user = await auth.authToken.verify(token);

  return new Res({
    user,
    password: null,
  });
});

// export const dummy = Controller([
//     authorize(({ visitor, level }) => [
//       visitor(false),
//       level(1),
//     ]),
//     validate(({ param }) => [
//       param('id').isInt(),
//     ]),
//   ],
//   async (req, res, rej) => {

//   },
// );
// export const login;

// export const resign;
