import { Router } from 'express';
import {
  login,
} from '../controllers/auth.controllers';

const router = Router();

// router.post('/')

router.post('/login', login);
// router.get('/', getPosts);
// router.get('/:id', getPost);
// router.put('/:id', updatePost);
// router.delete('/:id', deletePost);

export default router;
