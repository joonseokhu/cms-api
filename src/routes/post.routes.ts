import { Router } from 'express';
import {
  createDraftPost,
  getOnePost,
  getAllPosts,
  updatePost,
} from '../controllers/post.controllers';

const router = Router();

// router.post('/id', publishPost);
router.post('/', createDraftPost);
router.get('/', getAllPosts);
router.get('/:id', getOnePost);
router.put('/:id', updatePost);

export default router;
