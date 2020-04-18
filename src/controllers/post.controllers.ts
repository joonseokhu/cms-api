import * as postService from '@services/post.services';
import { Controller } from '@/api';

export const createDraftPost = Controller([], async (req, OK, NO) => {
  const post = await postService.createPost({ user: req.user });
  return OK(post);
});

export const getOnePost = Controller([], async (req, OK, NO) => {
  const { id } = req.params;
  const post = await postService.getOnePost({ id, user: req.user });
  return OK(post);
});

export const getAllPosts = Controller([], async (req, OK, NO) => {
  const { user: currentUser } = req;
  const {
    title,
    content,
    postStatus,
    postType,
    user,
    tag,
  } = (req.query as any);
  /**
   * @todo 쿼리 타입 맞춰줘야함
   */
  const posts = await postService.getPostsAndCount({
    title,
    content,
    postStatus,
    postType,
    user,
    tag,
    currentUser,
  });
  return OK(posts);
});

export const updatePost = Controller([], async (req, OK, NO) => {
  const { id } = req.params;
  const { body: data, user } = req;
  await postService.updatePost({ id, data, user });
  return OK();
});

export const deletePost = Controller([], async (req, OK, NO) => {
  const { id } = req.params;
  await postService.deletePost({ id, user: req.user });
  return OK();
});
