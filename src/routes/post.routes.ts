import { Router } from 'express';
import {
  createDraftPost,
  getOnePost,
  getAllPosts,
  updatePost,
  deletePost,
  votePost,
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

router.post('/:id/vote/:vote', votePost);
router.delete('/:id/vote/:vote', votePost);

export default router;
