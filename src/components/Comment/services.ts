import { useQuery, optionalEnum, isEqualID } from '@utils/db';
import $Article, { Article } from '@/components/Article/model';
import $Comment, { Comment } from '@/components/Comment/model';
import { vote, isOwner } from '@/components/UserContent/services';
import { User, SafeUser, USER } from '@/api/interfaces';
import { response } from '@/api';
import { WithPagination } from '@/api/hooks';
import {
  ArticleStatus, ArticleType, ContentType, CreateArticleProps,
} from '../Article/interfaces';

interface CreateCommentParams {
  content: string;
  user: USER;
  article: string;
}

type CreateComment = (params: CreateCommentParams) => Promise<Comment>;
export const createComment: CreateComment = async params => {
  const comment = await $Comment.create({
    content: params.content,
    createdBy: params.user.id,
    article: params.article,
  });
  return comment;
};

interface GetCommentsParams {
  user: USER;
  article: string;
  pagination: WithPagination;
}

type GetComments = (params: GetCommentsParams) => Promise<[Comment[], number]>;

export const getCommentsAndCount: GetComments = async params => {
  const {
    article,
    pagination,
  } = params;

  const query = useQuery.optionals({
    article,
  });

  console.log({ query });

  const comments = await pagination(
    $Comment
      .find(query)
      .populate('createdBy', '-password'),
  );
  const count = await $Comment.countDocuments(query);

  return [
    comments,
    count,
  ];
};

interface GetOneCommentParams {
  id: string;
  user?: USER;
}
type GetOneComment = (params: GetOneCommentParams) => Promise<Comment>;
export const getOneComment: GetOneComment = async params => {
  const comment = await $Comment.findOne({
    _id: params.id,
  });

  if (!comment) throw response.NO(404, 'Entity not found');
  return comment;
};

interface UpdateCommentParams {
  user: USER;
  id: string;
  content?: string;
}
type UpdateComment = (params: UpdateCommentParams) => Promise<Comment>;
export const updateComment: UpdateComment = async params => {
  const {
    user, id, content,
  } = params;

  console.log({ params });

  const comment = await getOneComment({ id });

  if (!isEqualID(comment.createdBy, user._id)) {
    throw response.NO(403, 'Not your entity');
  }

  const result = await $Comment.findOneAndUpdate({ _id: id }, {
    content,
  }, {
    new: true,
  });

  if (!result) throw response.NO(500, 'Update failed', result);

  return result;
};

interface VoteCommentParams {
  user: USER;
  id: string;
  voteType: string;
  voteMethod: string;
}
type VoteComment = (params: VoteCommentParams) => Promise<boolean>;
export const voteComment: VoteComment = async params => {
  const {
    user, id, voteType, voteMethod,
  } = params;

  const comment = await getOneComment({ id });
  const nextPayload = vote<Comment>({
    entity: comment,
    user,
    voteType,
    voteMethod,
  });
  const result = await $Comment.updateOne({ _id: id }, nextPayload);

  if (!result.ok) throw response.NO(500, 'Update failed', result);
  return !!result.nModified;
};

interface DeleteCommentParams {
  user: USER;
  id: string;
}
type DeleteComment = (params: DeleteCommentParams) => Promise<boolean>;
export const deleteComment: DeleteComment = async params => {
  const {
    user, id,
  } = params;

  const comment = await getOneComment({ id });

  if (!isEqualID(comment.createdBy, user._id)) {
    throw response.NO(403, 'Not your entity');
  }

  const result = await $Comment.deleteOne({ _id: id });

  if (!result.deletedCount) throw response.NO(500, 'Delete failed', result);
  return true;
};
