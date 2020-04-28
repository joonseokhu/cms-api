import { useQuery, optionalEnum, isEqualID } from '@utils/db';
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
  tag: PostTag,
  user?: SafeUser;
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

  const entities = await $Post.find(query).populate('createdBy', '-password');

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
  user: User|SafeUser;
  isVoteUp: boolean;
  isIncrementing: boolean;
}
export const votePost = async (params: VotePostParams): Promise<boolean> => {
  const {
    id, user, isVoteUp, isIncrementing,
  } = params;

  if (!user) {
    throw response.NO(403, 'Only Users can vote');
  }
  const userId = user?.id;
  const post = await getOnePost({ id, user });
  const { voteUps, voteDowns } = post;
  const hasVotedUp = voteUps.includes(userId);
  const hasVotedDown = voteDowns.includes(userId);

  if (isEqualID(post.createdBy.id, user.id)) {
    // 스스로에게 추천/비추천 하려 할때
    throw response.NO(403, 'Cannot vote oneself');
  }

  const nextVote = (() => {
    // 추천을 취소할 때
    if (hasVotedUp && isVoteUp && !isIncrementing) {
      return {
        voteUps: voteUps.filter(vote => !isEqualID(vote, userId)),
      };
    }

    // 비추천을 취소할때
    if (hasVotedDown && !isVoteUp && !isIncrementing) {
      return {
        voteDowns: voteDowns.filter(vote => !isEqualID(vote, userId)),
      };
    }

    // 새로 추천/비추천 할때
    if (!(hasVotedUp || hasVotedDown) && isIncrementing) {
      const key = isVoteUp ? 'voteUps' : 'voteDowns';
      return {
        [key]: post[key].concat(userId),
      };
    }

    // 그 외 경우는 던짐
    throw response.NO(403, 'Invalid vote', {
      hasVotedUp,
      hasVotedDown,
      isVoteUp,
      isIncrementing,
    });
  })();

  const result = await $Post.updateOne({ _id: id }, nextVote);

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
