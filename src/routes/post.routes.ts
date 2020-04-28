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

import {
  createComment,
  getAllComments,
} from '../controllers/comment.controllers';

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

router.post('/:postID/comment', createComment);
router.get('/:postID/comment', getAllComments);

// router.delete('/comment/:id', createComment);
// router.update('/comment/:id', createComment);
// router.post('/comment/:id/vote/:vote', createComment);
// router.delete('/comment/:id/vote/:vote', createComment);

export default router;
