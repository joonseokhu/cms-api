import { Router } from 'express';
import {
  register,
  getUser,
  getUsers,
} from './User.controllers';

const router = Router();

// router.post('/')

router.post('/register', register);

router.get('/:id', getUser);
router.get('/', getUsers);
// router.get('/:id', getPost);
// router.put('/:id', updatePost);
// router.delete('/:id', deletePost);

export default router;
