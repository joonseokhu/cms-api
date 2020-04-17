import { Router } from 'express';
import {
  createDraftPost,
  getOnePost,
  getAllPosts,
  updatePost,
  deletePost,
} from '../controllers/post.controllers';

const router = Router();

// router.post('/id', publishPost);
router.post('/', createDraftPost);
router.get('/', getAllPosts);
router.get('/:id', getOnePost);
router.put('/:id', updatePost);
router.delete('/:id', deletePost);

export default router;
