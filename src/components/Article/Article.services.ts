import { useQuery, optionalEnum, isEqualID } from '@utils/db';
import $Post, { Post } from '@/components/Article/Article.model';
import { PostTag } from '@/components/Tag/ArticleTag.model';
import { vote } from '@/components/UserContent/UserContent.services';
import { User, SafeUser, USER } from '@/api/interfaces';
import { response } from '@/api';
import {
  PostStatus, PostType, ContentType, CreatePostProps,
} from './Article.interfaces';

interface CreatePostParams {
  user: SafeUser;
}
export const createPost = async ({ user }: CreatePostParams): Promise<Post> => {
  console.log({
    createdBy: user._id,
    title: '',
    content: '',
  });
  const post = await $Post.create({
    createdBy: user._id,
    title: '',
    content: '',
  });
  return post;
};

interface GetOnePostParams {
  id: string;
  user?: SafeUser;
}
export const getOnePost = async (params: GetOnePostParams): Promise<Post> => {
  const { id } = params;
  const userId = params.user?.id || undefined;

  const post = await $Post.findOne({
    _id: id,
    $or: [
      { status: PostStatus.public },
      { createdBy: userId },
    ],
  }).populate('createdBy', '-password')
    .populate('tags');

  if (!post) throw response.NO(404, 'Entity not found');

  return post;
};

interface GetPostsAndCountParams {
  findKey: string|string[];
  findValue: string;
  postStatus?: PostStatus|string;
  postType?: PostType|string;
  createdBy?: string;
  tag: PostTag;
  user?: SafeUser;
  desc: boolean;
  page: number;
  limit: number;
}
interface GetPostsAndCountResult {
  entities: Post[];
  count: number;
}
interface GetPostsAndCount {
  (params: GetPostsAndCountParams): Promise<GetPostsAndCountResult>
}
export const getPostsAndCount: GetPostsAndCount = async params => {
  const {
    findKey,
    findValue,
    postStatus,
    postType,
    createdBy,
    tag,
    desc,
    page,
    limit,
  } = params;

  const user = params.user?.id || undefined;

  const query = {
    $and: [
      useQuery.findByString(findKey, findValue),
      useQuery.optionals({ postType }),
      useQuery.optionals({
        $or: [
          { status: PostStatus.public },
          { createdBy: user },
        ],
      }),
    ],
  };

  const entities = await $Post
    .find(query)
    .populate('createdBy', '-password')
    .limit(limit)
    .skip(limit * (page - 1));

  const count = await $Post.countDocuments(query);

  return {
    entities,
    count,
  };
};

type UpdateData = Omit<Post, 'createdBy'|'createdAt'|'publishedAt'|'updatedAt'>;
interface UpdatePostInterface {
  id: string;
  data: UpdateData;
  user?: SafeUser;
}
export const updatePost = async (params: UpdatePostInterface): Promise<Post> => {
  const {
    id,
    user,
    data,
  } = params;

  const post = await getOnePost({ id, user });
  if (!post) throw response.NO(404, 'Entity not found');

  if (!isEqualID(post.createdBy?.id, user?.id, true)) throw response.NO(403, 'Not your entity');

  // 태그가 다 유효한지 확인
  // const tags = data.tags.map()

  const result = await $Post.findOneAndUpdate({ _id: id }, useQuery.optionals({
    title: data.title,
    content: data.content,
    status: optionalEnum<PostStatus>(PostStatus, data.status),
    postType: optionalEnum<PostType>(PostType, data.postType),
    contentType: optionalEnum<ContentType>(ContentType, data.contentType),
    tags: data.tags,
  }));

  if (!result) throw response.NO(500, 'Update failed', result);

  return result;
};

// voteUps
// voteDowns
interface VotePostParams {
  id: string;
  user: USER;
  voteType: string;
  voteMethod: string;
}
export const votePost = async (params: VotePostParams): Promise<boolean> => {
  const {
    id, user, voteType, voteMethod,
  } = params;

  const post = await getOnePost({ id });
  const nextPayload = vote<Post>({
    entity: post,
    user,
    voteType,
    voteMethod,
  });
  const result = await $Post.updateOne({ _id: id }, nextPayload);

  if (!result.ok) throw response.NO(500, 'Update failed', result);

  return !!result.nModified;
};

interface DeletePostInterface {
  id: string;
  user?: SafeUser;
}
export const deletePost = async (params: DeletePostInterface): Promise<boolean> => {
  const {
    id,
    user,
  } = params;

  const post = await getOnePost({ id, user });
  if (!post) throw response.NO(404, 'Entity not found');
  if (!isEqualID(post.createdBy.id, user?.id)) throw response.NO(403, 'Not your entity');
  const result = await $Post.deleteOne({ _id: id });
  if (!result.deletedCount) throw response.NO(500, 'Delete failed', result);
  return true;
};
