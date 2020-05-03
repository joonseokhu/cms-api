import * as commentServices from '@/components/Comment/services';
import {
  Controller, validate, authorize, useControl,
} from '@/api';
import {

} from '@/api/hooks';
import { vote, isOwner } from '@/components/UserContent/services';
import { Comment } from '@/components/Comment/model';

export const createComment = Controller([
  validate(
    validate.param('articleID').isMongoId(),
    validate.body('content').isLength({ min: 2, max: 1400 }),
  ),
], async (req, OK, NO) => {
  const comment = await commentServices.createComment({
    content: req.body.content,
    article: req.params.articleID,
    user: req.user,
  });

  return OK(comment);
});

export const getAllComments = Controller([
  validate.param('articleID').isMongoId(),
  validate.pagination(),
], async (req, OK, NO) => {
  const pagination = useControl.pagination(req);
  const [entities, count] = await commentServices.getCommentsAndCount({
    user: req.user,
    pagination,
    article: req.params.articleID,
  });
  return OK({
    entities,
    count,
  });
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

export const voteComment = Controller([
  authorize(),
  validate(
    validate.param('id').isMongoId(),
    validate.param('vote').isIn(['up', 'down']),
  ),
], async (req, OK, NO) => {
  const result = await commentServices.voteComment({
    user: req.user,
    id: req.params.id,
    voteType: req.params.vote,
    voteMethod: req.method,
  });

  return OK(result);
});
