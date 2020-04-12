import { checkUserPassword } from '@services/auth.services';
import authToken from '@services/auth/authToken';
import { Controller } from '@/api';

export const login = Controller([], async (req, OK, NO) => {
  const {
    email,
    password,
  } = req.body;

  const user = await checkUserPassword({ email }, password);

  const token = await authToken.sign(user);

  return OK({
    token,
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
