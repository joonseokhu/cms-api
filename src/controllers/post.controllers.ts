import { getRepository } from 'typeorm';
import { Middleware } from '@/interfaces';
import { Post } from '@/models/post.model';

export const createPost: Middleware = async (req, res, next) => {
  try {
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

    res.json({
      data: result,
    });
  } catch (err) {
    next(err);
  }
};

export const getPosts: Middleware = async (req, res, next) => {
  try {
    // const { } = req.query;
    const [result, count] = await getRepository(Post).findAndCount();

    res.json({
      data: {
        result,
        count,
      },
    });
  } catch (err) {
    next(err);
  }
};

export const getPost: Middleware = async (req, res, next) => {
  try {
    const { id } = req.params;

    const result = await getRepository(Post).findOne(id);

    res.json({
      data: result,
    });
  } catch (err) {
    next(err);
  }
};

export const updatePost: Middleware = async (req, res, next) => {
  try {
    const { id } = req.params;
    const data = req.body;

    const result = await getRepository(Post).update(id, data);

    res.json({
      data: result,
    });
  } catch (err) {
    next(err);
  }
};

export const deletePost: Middleware = async (req, res, next) => {
  try {
    const { id } = req.params;
    const result = await getRepository(Post).delete(id);

    res.json(result);
  } catch (err) {
    next(err);
  }
};
