import { Router } from 'express';
import article from '@/components/Article/routes';
import user from '@/components/User/routes';
import auth from '@/components/User/auth.routes';
import comment from '@/components/Comment/routes';
import settlement from '@/api/settlement.routes';

const router = Router();

router.use('/article', article);
router.use('/comment', comment);
router.use('/user', user);
router.use('/auth', auth);

router.use(settlement);

export { settlement };
export default router;
