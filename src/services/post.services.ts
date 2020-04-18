import { useQuery, optionalEnum } from '@utils/db';
import $Post, { Post } from '@models/post.model';
import { PostTag } from '@models/postTag.model';
import { User, SafeUser } from '@/api/interfaces';
import { response } from '@/api';
import {
  PostStatus, PostType, ContentType, CreatePostProps,
} from '../interfaces/post.interfaces';

interface CreatePostParams {
  user: SafeUser;
}
export const createPost = async ({ user }: CreatePostParams): Promise<Post> => {
  const post = await $Post.create({
    user: user._id,
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
  const { id: _id } = params;
  const user = params.user?._id || undefined;

  const post = await $Post.findOne({
    _id,
    $or: [
      { postStatus: PostStatus[PostStatus.public] },
      { user },
    ],
  }).populate('user', '-password');

  if (!post) throw response.NO(404, 'Entity not found');

  return post;
};

interface GetPostsAndCountParams {
  title?: string;
  content?: string;
  postStatus?: PostStatus|string;
  postType?: PostType|string;
  user?: SafeUser;
  tag: PostTag,
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
    title,
    content,
    postStatus,
    postType,
    tag,
  } = params;
  const user = params.user?._id || undefined;

  const query = useQuery.optionals({
    ...useQuery.findByString(
      { title },
      { content },
      { title, content },
    ),
    postType,
    $or: [
      { postStatus: PostStatus.public },
      { user },
    ],
  });

  const entities = await $Post.find(query).populate('user', '-password');

  const count = await $Post.estimatedDocumentCount(query);

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
export const updatePost = async (params: UpdatePostInterface): Promise<boolean> => {
  const {
    id,
    user,
    data,
  } = params;

  const post = await getOnePost({ id, user });
  if (!post) throw response.NO(404, 'Entity not found');
  if (post.createdBy._id !== user?._id) throw response.NO(403, 'Not your entity');

  // 태그가 다 유효한지 확인
  // const tags = data.tags.map()

  const result = await $Post.update({ _id: id }, useQuery.optionals({
    title: data.title,
    content: data.content,
    status: optionalEnum<PostStatus>(PostStatus, data.status),
    postType: optionalEnum<PostType>(PostType, data.postType),
    contentType: optionalEnum<ContentType>(ContentType, data.contentType),
    tags: data.tags,
  }));
  if (!result.nModified) throw response.NO(500, 'Update failed', result);
  return true;
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
  if (post.createdBy._id !== user?._id) throw response.NO(403, 'Not your entity');
  const result = await $Post.remove({ _id: id });
  if (!result.deletedCount) throw response.NO(500, 'Delete failed', result);
  return true;
};
