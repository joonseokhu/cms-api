import { Request } from 'express';
import NO from '@/api/Rejection';
import { Middleware, SafeUser } from '@/api/interfaces';
import { respond } from '@/api/Controller';
import { UserStatus } from '../interfaces/user.interfaces';

interface Authorizer {
  (user: SafeUser): null|string|string[];
}

// type Authorize = (...authorizers: Authorizer[]) => (user: SafeUser) => Promise<string[]>;
type Authorize = (...authorizers: Authorizer[]) => Middleware;

interface testAuthorizers {
  (authorizers: Authorizer[], user: SafeUser): testAuthorizers['return']
  return?: {
    hasAllPassed: boolean;
    hasAllFailed: boolean;
    errors: string[]
  }
}

const testAuthorizers: testAuthorizers = (authorizers, user) => {
  const errors = authorizers
    .map(authorizer => authorizer(user))
    .filter(error => (
      Array.isArray(error) ? error.length : error
    ));
  const failedCount = errors.length;
  const passedCount = authorizers.length - failedCount;
  return {
    hasAllPassed: !failedCount,
    hasAllFailed: !passedCount,
    errors: errors.flat(),
  };
};

const hasAuth = (authStatus: boolean): Authorizer => user => {
  const message = `expected ${authStatus ? 'user' : 'visitor'}, they are ${user ? 'user' : 'visitor'}`;
  return (authStatus === !!user)
    ? null
    : message;
};

const userStatus = (requiredStatus: UserStatus): Authorizer => user => {
  if (!user) return `required ${requiredStatus} but not authenticated`;
  return (requiredStatus === user.status)
    ? null
    : `required status: ${requiredStatus}, current status: ${user.status}`;
};

const and = (...authorizers: Authorizer[]): Authorizer => user => {
  const { hasAllPassed, errors } = testAuthorizers(authorizers, user);
  return hasAllPassed
    ? null
    : errors;
};

const or = (...authorizers: Authorizer[]): Authorizer => user => {
  const { hasAllFailed, errors } = testAuthorizers(authorizers, user);
  return !hasAllFailed
    ? null
    : errors;
};

// const authorize: Authorize = (...authorizers) => user => {
//   const { hasAllPassed, errors } = testAuthorizers(authorizers, user);
//   return hasAllPassed ? [] : errors;
// };
const authorize: Authorize = (...authorizers) => {
  const handIn: Middleware = async (req, res, next) => {
    const { hasAllPassed, errors } = testAuthorizers(authorizers, req.user);
    return hasAllPassed
      ? next()
      : respond(
        res,
        NO(403, '권한이 없습니다.', errors),
      );
  };
  return handIn;
};

export default Object.assign(authorize, {
  hasAuth,
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
