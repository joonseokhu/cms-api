import { PostStatus, PostType, ContentType } from '@interfaces/post.interfaces';
import * as postService from '@services/post.services';
import { Post } from '@models/post.model';
import { Controller } from '@/api';

export const createDraftPost = Controller([], async (req, OK, NO) => {
  const post = await postService.createPost(req.user);
  return OK(post);
});

export const getOnePost = Controller([], async (req, OK, NO) => {
  const id = Number(req.params.id);
  const post = await postService.getPost({ id }, req.user);
  return OK(post);
});

export const getAllPosts = Controller([], async (req, OK, NO) => {
  const posts = await postService.getPost(req.query, req.user);
  return OK(posts);
});

export const updatePost = Controller([], async (req, OK, NO) => {
  const id = Number(req.params.id);
  const currentPost = await postService.getPost({ id }, req.user);
  if ((currentPost as Post).user.id !== req.user.id) throw NO(403, 'Not your entity(ies)');
  const nextPost = await postService.updatePost(id, req.body);
  return OK();
});

export const deletePost = Controller([], async (req, OK, NO) => {
  const id = Number(req.params.id);
  const currentPost = await postService.getPost({ id }, req.user);
  if ((currentPost as Post).user.id !== req.user.id) throw NO(403, 'Not your entity(ies)');
  const nextPost = await postService.deletePost(id);
  return OK();
});
