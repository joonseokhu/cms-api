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
  const { query, user } = req;
  const posts = await postService.getPostsAndCount({ ...query, user });
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
