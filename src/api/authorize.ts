import { Request } from 'express';
import * as auth from '@services/auth';
import NO from '@/api/Rejection';
import { Middleware } from '@/api/interfaces';
import { respond } from '@/api/Controller';

export const getUser = async (req: Request) => {
  const [authType, authToken] = req.headers.authorization.split(' ');
  const result = await auth.authToken.verify(authToken);
  const { password, ...user } = result;
  return user;
};

interface Authorizer {
  (user: object): boolean;
}
interface AuthorizerGenerator<Option> {
  (option: Option): Authorizer;
}

type Authorize = (...authorizers: Authorizer[]) => Middleware;

const isUser: AuthorizerGenerator<boolean> = shouldBeUser => user => {
  console.log(`expected ${shouldBeUser ? 'user' : 'visitor'}, they are ${user ? 'user' : 'visitor'}`);
  return (shouldBeUser === !!user);
};

const authorize: Authorize = (...authorizers) => {
  const handIn: Middleware = async (req, res, next) => {
    const hasError = authorizers
      .map(authorizer => authorizer(req.user))
      .filter(e => !e)
      .length;
    if (hasError) {
      return respond(
        res,
        NO(403, '권한이 없습니다.'),
      );
    }
    return next();
  };
  return handIn;
};

export default Object.assign(authorize, {
  isUser,
});


/**
 * 비회원만
 * 회원만
 * 관리자만
 * 이 엔티티의 작성자만
 * 이 엔티티의 작성자가 아닌 사람만
 * 특정 태그에 포함된 사람만
 */
