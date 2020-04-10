import { Request } from 'express';
import * as auth from '@services/auth';
import NO from '@/api/Rejection';
import { Middleware } from '@/api/interfaces';
import { respond } from '@/api/Controller';

interface Authorizer {
  (user: object): boolean;
}

type Authorize = (...authorizers: Authorizer[]) => Middleware;

const testAuthorizers = (authorizers: Authorizer[], user: object): [boolean, boolean] => {
  const passedCount = authorizers.map(authorizer => authorizer(user))
    .filter(Boolean)
    .length;
  const failedCount = authorizers.length - passedCount;
  console.log({ passedCount, failedCount });
  // [모두 통과했는지, 모두 실패했는지]
  return [!failedCount, !passedCount];
};

const isUser = (shouldBeUser: boolean): Authorizer => user => {
  console.log(`expected ${shouldBeUser ? 'user' : 'visitor'}, they are ${user ? 'user' : 'visitor'}`);
  return (shouldBeUser === !!user);
};

const and = (...authorizers: Authorizer[]): Authorizer => user => {
  const [hasAllPassed, hasAllFailed] = testAuthorizers(authorizers, user);
  return hasAllPassed;
};

const or = (...authorizers: Authorizer[]): Authorizer => user => {
  const [hasAllPassed, hasAllFailed] = testAuthorizers(authorizers, user);
  return !hasAllFailed;
};

const authorize: Authorize = (...authorizers) => {
  const handIn: Middleware = async (req, res, next) => {
    const [hasAllPassed, hasAllFailed] = testAuthorizers(authorizers, req.user);
    return hasAllPassed
      ? next()
      : respond(
        res,
        NO(403, '권한이 없습니다.'),
      );
  };
  return handIn;
};

export default Object.assign(authorize, {
  isUser,
  and,
  or,
});


/**
 * 비회원만
 * 회원만
 * 관리자만
 * 이 엔티티의 작성자만
 * 이 엔티티의 작성자가 아닌 사람만
 * 특정 태그에 포함된 사람만
 */
