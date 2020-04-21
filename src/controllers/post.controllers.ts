import * as postService from '@services/post.services';
import { Controller, validate, authorize } from '@/api';

export const createDraftPost = Controller([], async (req, OK, NO) => {
  const post = await postService.createPost({ user: req.user });
  return OK(post);
});

export const getOnePost = Controller([], async (req, OK, NO) => {
  const { id } = req.params;
  const post = await postService.getOnePost({ id, user: req.user });
  return OK(post);
});

export const getAllPosts = Controller([
  validate(
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
  } = (req.query as any);
  /**
   * @todo 쿼리 타입 맞춰줘야함
   */
  const posts = await postService.getPostsAndCount({
    findKey,
    findValue,
    postStatus,
    postType,
    createdBy,
    tag,
    user,
  });
  return OK(posts);
});

export const updatePost = Controller([], async (req, OK, NO) => {
  const { id } = req.params;
  const { body: data, user } = req;
  const result = await postService.updatePost({ id, data, user });
  return OK(result);
});

export const deletePost = Controller([], async (req, OK, NO) => {
  const { id } = req.params;
  await postService.deletePost({ id, user: req.user });
  return OK();
});
