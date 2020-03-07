import { Router } from 'express';
import {
  getPosts,
  createPost,
  getPost,
  updatePost,
  deletePost,
} from '../controllers/post.controllers';

const router = Router();

router.post('/', createPost);
router.get('/', getPosts);
router.get('/:id', getPost);
router.put('/:id', updatePost);
router.delete('/:id', deletePost);

export default router;
