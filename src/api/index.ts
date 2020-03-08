import { Router } from 'express';
import post from '@routes/post.routes';
import user from '@routes/user.routes';
import auth from '@routes/auth.routes';
import settlement from './errors/error.routes';
// import tag from './tag';

const router = Router();

router.use('/post', post);
router.use('/user', user);
router.use('/auth', auth);
// router.use('/tag', tag);

router.use(settlement);

export default router;
