import { useQuery, optionalEnum } from '@utils/db';
import $PostTag, { PostTag } from '@/components/Tag/ArticleTag.model';
import { Post } from '@/components/Article/model';
import { User, SafeUser } from '@/components/User/model';

interface CreatePostTagParams {
  name: string;
  description?: string;
  user: SafeUser;
}
export const createTag = async (params: CreatePostTagParams): Promise<PostTag> => {
  const {
    name,
    description = '',
    user,
  } = params;

  const postTag = await $PostTag.create({
    name,
    description,
    createdBy: user._id,
  });

  return postTag;
};

interface GetPostTagsAndCountParams {
  // findKey: string|string[];
  // findValue: string;
  name: string;
  post: string;
}
interface GetPostsAndCountResult {
  entities: PostTag[];
  count: number;
}
interface GetPostTagsAndCount {
  (params: GetPostTagsAndCountParams): Promise<GetPostsAndCountResult>
}
export const getPostTagsAndCount: GetPostTagsAndCount = async params => {
  const { name, post } = params;

  const findByPost = { post };

  const query = useQuery.optionals({
    name: { $regex: `.*${name}.*` },
    post: post ? findByPost : undefined,
  });

  console.log({ query });

  const entities = await $PostTag.find(query);
  const count = await $PostTag.countDocuments(query);

  return {
    entities,
    count,
  };
};
