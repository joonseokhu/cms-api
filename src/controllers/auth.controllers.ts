import * as auth from '@services/auth';
import { Middleware } from '@/interfaces';

export const login: Middleware = async (req, res, next) => {
  try {
    const {
      email,
      password,
    } = req.body;

    const user = await auth.checkPassword({ email }, password);

    const token = await auth.authToken.sign(user);

    res.json({
      token,
    });
  } catch (err) {
    next(err);
  }
};

export const checkToken: Middleware = async (req, res, next) => {
  try {
    const [authType, token] = req.headers.authorization.split(' ');
    const user = await auth.authToken.verify(token);

    res.json({
      user,
      password: null,
    });
  } catch (err) {
    next(err);
  }
};

// export const login;

// export const resign;
