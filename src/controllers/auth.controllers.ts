import * as auth from '@services/auth';
import {
  Rejection, Resolution, response, Middleware,
} from '@/api';

export const login = Middleware(async (req, Res, Rej) => {
  const {
    email,
    password,
  } = req.body;

  const user = await auth.checkPassword({ email }, password);

  const token = await auth.authToken.sign(user);

  return new Res({
    token,
  });
});

export const checkToken = Middleware(async (req, Res, Rej) => {
  const [authType, token] = req.headers.authorization.split(' ');
  const user = await auth.authToken.verify(token);

  return new Res({
    user,
    password: null,
  });
});

// export const login;

// export const resign;
