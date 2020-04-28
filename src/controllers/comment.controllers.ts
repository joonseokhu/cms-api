import * as commentServices from '@services/comment.services';
import { Controller, validate, authorize } from '@/api';
import { vote, isOwner } from '@/services/contentEntity.services';
import { Comment } from '@models/Comment.model';

export const createComment = Controller([
  validate(
    validate.param('postID').isMongoId(),
    validate.body('content').isLength({ min: 2, max: 1400 }),
  ),
], async (req, OK, NO) => {
  const comment = await commentServices.createComment({
    content: req.body.content,
    post: req.params.postID,
    user: req.user,
  });

  return OK(comment);
});

export const getAllComments = Controller([
  validate.param('postID').isMongoId(),
], async (req, OK, NO) => {
  const result = await commentServices.getComments({
    user: req.user,
    post: req.params.postID,
  });
  return OK(result);
});

export const updateComment = Controller([
  authorize(
    authorize.hasAuth(true),
  ),
  validate(
    validate.param('id').isMongoId(),
    validate.body('content').isLength({ min: 2, max: 1400 }),
  ),
], async (req, OK, NO) => {
  const result = await commentServices.updateComment({
    id: req.params.id,
    user: req.user,
    content: req.body.content,
  });
  // isOwner({ entity: })
  return OK(result);
});

export const deleteComment = Controller([
  authorize(
    authorize.hasAuth(true),
  ),
  validate(
    validate.param('id').isMongoId(),
  ),
], async (req, OK, NO) => {
  const result = await commentServices.deleteComment({
    id: req.params.id,
    user: req.user,
  });
  return OK(result);
});

export const voteComment = Controller([], async (req, OK, NO) => {
  const result = await commentServices.voteComment({
    user: req.user,
    id: req.params.id,
    voteType: req.params.vote,
    voteMethod: req.method,
  });

  return OK(result);
});
