import { Router } from 'express';
import post from '@routes/post.routes';
import user from '@routes/user.routes';
import auth from '@routes/auth.routes';
import settlement from '@/api/settlement.routes';
// import tag from './tag';

const router = Router();

router.use('/post', post);
router.use('/user', user);
router.use('/auth', auth);
// router.use('/tag', tag);

router.use(settlement);

export { settlement };
export default router;
