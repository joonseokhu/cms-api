import { useQuery, optionalEnum, isEqualID } from '@utils/db';
import $Post, { Post } from '@models/post.model';
import $Comment, { Comment } from '@models/Comment.model';
import { User, SafeUser } from '@/api/interfaces';
import { response } from '@/api';
import {
  PostStatus, PostType, ContentType, CreatePostProps,
} from '../interfaces/post.interfaces';

interface CreateCommentParams {
  content: string;
  user: User;
}
type CreateComment = (params: CreateCommentParams) => Promise<Comment>;
export const createComment: CreateComment = async params => {
  const comment = await $Comment.create({
    content: params.content,
    createdBy: params.user,
  });
  return comment;
};

interface GetCommentsParams {
  user: User;
  post: Post;
}
interface GetCommentsAndCountResult {
  entities: Comment[];
  count: number;
}
type GetComments = (params: GetCommentsParams) => Promise<GetCommentsAndCountResult>;
export const getComments: GetComments = async params => {
  const query = {};

  const entities = await $Comment.find(query);
  const count = await $Comment.countDocuments(query);

  return {
    entities,
    count,
  };
};
