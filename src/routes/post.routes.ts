import { Router } from 'express';
import {
  createDraftPost,
  getOnePost,
  getAllPosts,
  updatePost,
  deletePost,
} from '../controllers/post.controllers';

import {
  createPostTag,
  getPostTags,
} from '../controllers/postTag.controllers';

const router = Router();

// router.post('/id', publishPost);
router.post('/', createDraftPost);
router.get('/', getAllPosts);
router.get('/tag', getPostTags);
router.post('/tag', createPostTag);

router.get('/:id', getOnePost);
router.put('/:id', updatePost);
router.delete('/:id', deletePost);

export default router;
