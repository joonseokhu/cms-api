import * as postTagService from '@services/postTag.services';
import { Controller, validate, authorize } from '@/api';

export const createPostTag = Controller([
  authorize(
    authorize.hasAuth(true),
  ),
  validate(
    validate.body('name').isLength({ min: 2 }),
  ),
], async (req, OK, NO) => {
  const tag = await postTagService.createTag({
    name: req.body.name,
    description: req.body.description,
    user: req.user,
  });
  return OK(tag);
});

export const getPostTags = Controller([
  validate(
    validate.query('name').optional().isLength({ min: 2 }),
  ),
], async (req, OK, NO) => {
  const {
    name,
    post,
  } = (req.query as any);
  const tags = await postTagService.getPostTagsAndCount({
    name,
    post,
  });
  return OK(tags);
});
