import { Router } from 'express';
import article from '@/components/Article/routes';
import user from '@/components/User/routes';
import auth from '@/components/User/auth.routes';
import comment from '@/components/Comment/routes';
import settlement from '@/api/settlement.routes';

import { Controller } from '@/api';

import File from '@components/File/services';

const file = new File('File', 'multertest');

const router = Router();

router.use('/article', article);
router.use('/comment', comment);
router.use('/user', user);
router.use('/auth', auth);

router.post('/file', Controller([], async (req, OK, NO) => {
  const result = await file.createFile(req);
  console.log('result', result);
  return OK(result);
}));

router.use(settlement);

export { settlement };
export default router;
