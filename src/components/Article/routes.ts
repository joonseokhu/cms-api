import { Router } from 'express';
import {
  createDraftArticle,
  getOneArticle,
  getAllArticles,
  updateArticle,
  deleteArticle,
  voteArticle,
  createArticleTag,
  getArticleTags,
  getTagsOfArticle,
} from '@/components/Article/controllers';

import {
  createComment,
  getAllComments,
} from '@/components/Comment/controllers';

const router = Router();

// router.post('/id', publishArticle);
router.post('/', createDraftArticle);
router.get('/', getAllArticles);

router.get('/tag', getArticleTags);
router.post('/tag', createArticleTag);
router.get('/:id/tag', getTagsOfArticle);

router.get('/:id', getOneArticle);
router.put('/:id', updateArticle);
router.delete('/:id', deleteArticle);


router.post('/:id/vote/:vote', voteArticle);
router.delete('/:id/vote/:vote', voteArticle);

router.post('/:articleID/comment', createComment);
router.get('/:articleID/comment', getAllComments);

// router.delete('/comment/:id', createComment);
// router.update('/comment/:id', createComment);
// router.post('/comment/:id/vote/:vote', createComment);
// router.delete('/comment/:id/vote/:vote', createComment);

export default router;
