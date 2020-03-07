import { getRepository } from 'typeorm';
import { Post } from '@/models/post.model';
import {
  PostStatus, PostType, ContentType, CreatePostProps,
} from '../interfaces/post.interfaces';

// title,
// content,
// postStatus,
// postType,
// contentType,
// tags,

export const draftPost = async (): Promise<object> => {
  const post = new Post();
  const result = await getRepository(Post).save(post);
  return result;
};

export const savePost = async (props: CreatePostProps): Promise<object> => {
  const respository = getRepository(Post);
  const post = await respository.findOne(props.id);
  post.title = props.title;
  post.content = props.content;
  post.postStatus = props.postStatus || undefined;
  post.postType = props.postType || undefined;
  post.contentType = props.contentType || undefined;
  // post.tags = props.tags || [];

  const result = await respository.save(post);
  return result;
};
