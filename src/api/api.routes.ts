import { Router } from 'express';
import post from '@/components/Article/Article.routes';
import user from '@/components/User/User.routes';
import auth from '@/components/User/auth.routes';
import comment from '@/components/Comment/Comment.routes';
import settlement from '@/api/settlement.routes';
// import tag from './tag';

const router = Router();

router.use('/post', post);
router.use('/comment', comment);
router.use('/user', user);
router.use('/auth', auth);
// router.use('/tag', tag);

router.use(settlement);

export { settlement };
export default router;
