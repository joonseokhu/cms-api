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
    validate.query('findKey'),
    validate.query('findValue'),
  ),
], async (req, OK, NO) => {
  const {
    findKey,
    findValue,
    post,
  } = (req.query as any);
  const tags = await postTagService.getPostTagsAndCount({
    findKey,
    findValue,
    post,
  });
  return OK(tags);
});
