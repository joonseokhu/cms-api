import { getManager } from 'typeorm';
// import { optionalFindQuery, AddOption } from '@utils/db';
import $Post, { Post } from '@models/post.model';
import { User, SafeUser } from '@/api/interfaces';
import { response } from '@/api';
import {
  PostStatus, PostType, ContentType, CreatePostProps,
} from '../interfaces/post.interfaces';

// title,
// content,
// postStatus,
// postType,
// contentType,
// tags,

export const createPost = async (currentUser: SafeUser): Promise<Post> => {
  const post = await $Post.create({
    user: currentUser._id,
    title: '',
    content: '',
  });
  return post;
};

export const getPost = async (query: any, currentUser: SafeUser): Promise<Post|Post[]> => {
  const {
    id,
    title,
    postStatus,
    postType,
  } = query;

  const user = Number(query.user) || undefined;

  const currentUserId = currentUser?.id || 0;

  if (id) {
    const post = await $Post.findOne({
      _id: id,
      $or: [
        { postStatus: PostStatus[PostStatus.public] },
        { postStatus, user: currentUserId },
      ],
    }).populate('user', '-password');
    if (!post) throw response.NO(404, 'Entity not found');
    return post;
  }

  const posts = await $Post.find({
    title,
    postType,
    $or: [
      { user: currentUserId },
      { postStatus: PostStatus[PostStatus.public] },
    ],
  }).populate('user', '-password');
  return posts;
};

export const updatePost = async (_id: number, data: any): Promise<any> => {
  // const nextPost = Object.assign(post, data);
  const result = await $Post.update({ _id }, data);
  // if (!result.nModified) throw response.NO(404, 'Entity not found');
  return result;
};

export const deletePost = async (_id: number): Promise<any> => {
  // const nextPost = Object.assign(post, data);
  const result = await $Post.remove({ _id });
  // if (!result.nRemoved) throw response.NO(404, 'Entity not found');
  return result;
};
