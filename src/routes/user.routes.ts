import { Router } from 'express';
import {
  register,
} from '../controllers/user.controllers';

const router = Router();

// router.post('/')

router.post('/register', register);
// router.get('/', getPosts);
// router.get('/:id', getPost);
// router.put('/:id', updatePost);
// router.delete('/:id', deletePost);

export default router;
