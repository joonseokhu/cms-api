import { getRepository } from 'typeorm';
import { Post } from '@/models/post.model';
import { Middleware } from '@/api';

export const createPost = Middleware(async (req, Res, Rej) => {
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

  return new Res(result);
});

export const getPosts = Middleware(async (req, Res, Rej) => {
  // const { } = req.query;
  const [results, count] = await getRepository(Post).findAndCount();

  return new Res({
    results,
    count,
  });
});

export const getPost = Middleware(async (req, Res, Rej) => {
  const { id } = req.params;

  const result = await getRepository(Post).findOne(id);

  return new Res(result);
});

export const updatePost = Middleware(async (req, Res, Rej) => {
  const { id } = req.params;
  const data = req.body;

  const result = await getRepository(Post).update(id, data);

  return new Res(result);
});

export const deletePost = Middleware(async (req, Res, Rej) => {
  const { id } = req.params;
  const result = await getRepository(Post).delete(id);

  return new Res(result);
});
