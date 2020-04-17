import { Router } from 'express';
import {
  login,
  validateToken,
} from '../controllers/auth.controllers';

const router = Router();

// router.post('/')

router.post('/login', login);
router.get('/validate', validateToken);
// router.get('/', getPosts);
// router.get('/:id', getPost);
// router.put('/:id', updatePost);
// router.delete('/:id', deletePost);

export default router;
