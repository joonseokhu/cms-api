import NO from '@/api/Rejection';
import { Middleware } from '@/api/interfaces';
import { respond } from '@/api/Controller';

interface Authorize {
  (...userSymbols: UserSymbols[]): Middleware[],

}

const authorize: Authorize = () => {
  console.log();
  return [
    (req, res, next) => {

    },
  ];
};

export default authorize;
