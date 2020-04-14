import { getManager } from 'typeorm';
import { optionalFindQuery, AddOption } from '@utils/db';
import { Post } from '@/models/post.model';
import { User } from '@/api/interfaces';
import {
  PostStatus, PostType, ContentType, CreatePostProps,
} from '../interfaces/post.interfaces';
import { response } from '@/api';

// title,
// content,
// postStatus,
// postType,
// contentType,
// tags,

export const createPost = async (currentUser: User): Promise<Post> => {
  const db = getManager();
  const post = new Post();
  post.user = currentUser;
  const result = await db.save(post);
  return result;
};

export const getPost = async (query: any, currentUser: User): Promise<Post|Post[]> => {
  const db = getManager();
  const {
    id,
    title,
    postStatus,
    postType,
  } = query;
  const user = Number(query.user) || undefined;
  const me = currentUser?.id;

  if (id) {
    const post = await db.findOne(Post, {
      where: AddOption({
        id,
      }, [
        { postStatus: PostStatus.public },
        { postStatus, user: me },
      ]),
      relations: ['user'],
    });
    if (!post) throw response.NO(404, 'Entity not found');
    return post;
  }

  // console.log(
  //   (!user || (!!me && !!user && (user === me))) ? me : null
  // );

  const posts = await db.find(Post, {
    where: AddOption({
      title,
      postType,
    }, [
      // { user: (!user || (!!me && !!user && (user === me))) ? me : null, postStatus },
      { user, postStatus: PostStatus.public },
    ]),
    relations: ['user'],
  });
  return posts;
};

export const updatePost = async (id: number, data: any): Promise<any> => {
  const db = getManager();
  // const nextPost = Object.assign(post, data);
  const result = await db.update(Post, id, data);
  if (!result.raw.changedRows) throw response.NO(404, 'Entity not found');
  return true;
};

export const deletePost = async (id: number): Promise<any> => {
  const db = getManager();
  // const nextPost = Object.assign(post, data);
  const result = await db.delete(Post, id);
  if (!result.raw.changedRows) throw response.NO(404, 'Entity not found');
  return true;
};
