import * as articleService from '@/components/Article/services';
import { Controller, validate, authorize } from '@/api';

export const createDraftPost = Controller([], async (req, OK, NO) => {
  const post = await articleService.createPost({ user: req.user });
  return OK(post);
});

export const getOnePost = Controller([], async (req, OK, NO) => {
  const { id } = req.params;
  const post = await articleService.getOnePost({ id, user: req.user });
  return OK(post);
});

export const getAllPosts = Controller([
  validate(
    validate.pagination(),
    validate.findByString(
      'title',
      ['title', 'content'],
    ),
  ),
], async (req, OK, NO) => {
  // console.log({ query: req.query });
  const { user } = req;
  const {
    findKey,
    findValue,
    postStatus,
    postType,
    createdBy,
    tag,
    desc,
    page,
    limit,
  } = (req.query as any);
  /**
   * @todo 쿼리 타입 맞춰줘야함
   */
  const posts = await articleService.getPostsAndCount({
    findKey,
    findValue,
    postStatus,
    postType,
    createdBy,
    tag,
    user,
    desc,
    page,
    limit,
  });
  return OK(posts);
});

export const votePost = Controller([
  authorize(
    authorize.hasAuth(true),
  ),
  validate(
    validate.param('id').isMongoId(),
    validate.param('vote').isIn(['up', 'down']),
  ),
], async (req, OK, NO) => {
  const result = await articleService.votePost({
    user: req.user,
    id: req.params.id,
    voteType: req.params.vote,
    voteMethod: req.method,
  });
  return OK(result);
});

export const updatePost = Controller([], async (req, OK, NO) => {
  const { id } = req.params;
  const { body: data, user } = req;
  const result = await articleService.updatePost({ id, data, user });
  return OK(result);
});

export const deletePost = Controller([], async (req, OK, NO) => {
  const { id } = req.params;
  await articleService.deletePost({ id, user: req.user });
  return OK();
});
