import { Router } from 'express';

import {
  updateComment,
  deleteComment,
  voteComment,
} from '../controllers/comment.controllers';

const router = Router();

router.put('/:id', updateComment);
router.delete('/:id', deleteComment);

router.post('/:id/vote/:vote', voteComment);
router.delete('/:id/vote/:vote', voteComment);

export default router;
