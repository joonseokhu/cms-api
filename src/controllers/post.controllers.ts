import { getRepository } from 'typeorm';
import { Post } from '@/models/post.model';
import { Controller } from '@/api';

export const createPost = Controller([], async (req, OK, NO) => {
  const {
    title,
    content,
  } = req.body;

  const post = new Post();

  post.title = title;
  post.content = content;
  // post.postStatus
  // post.postType
  // post.contentType
  // post.tags

  const result = await getRepository(Post).save(post);

  return OK(result);
});

export const getPosts = Controller([], async (req, OK, NO) => {
  // const { } = req.query;
  const [results, count] = await getRepository(Post).findAndCount();

  return OK({
    results,
    count,
  });
});

export const getPost = Controller([], async (req, OK, NO) => {
  const { id } = req.params;

  const result = await getRepository(Post).findOne(id);

  return OK(result);
});

export const updatePost = Controller([], async (req, OK, NO) => {
  const { id } = req.params;
  const data = req.body;

  const result = await getRepository(Post).update(id, data);

  return OK(result);
});

export const deletePost = Controller([], async (req, OK, NO) => {
  const { id } = req.params;
  const result = await getRepository(Post).delete(id);

  return OK(result);
});
