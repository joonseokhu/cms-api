import { useQuery, optionalEnum, isEqualID } from '@utils/db';
import $Article, { Article, $ArticleTag } from '@components/Article/model';
import { Tag } from '@components/Tag/model';
import { vote } from '@components/UserContent/services';
import { User, SafeUser, USER } from '@/api/interfaces';
import { response } from '@/api';
import { WithPagination } from '@/api/hooks';
import {
  ArticleStatus, ArticleType, ContentType, CreateArticleProps,
} from './interfaces';

interface CreateArticleParams {
  user: SafeUser;
}
export const createArticle = async ({ user }: CreateArticleParams): Promise<Article> => {
  console.log({
    createdBy: user._id,
    title: '',
    content: '',
  });
  const article = await $Article.create({
    createdBy: user._id,
    title: '',
    content: '',
  });
  return article;
};

interface GetOneArticleParams {
  id: string;
  user?: SafeUser;
}
export const getOneArticle = async (params: GetOneArticleParams): Promise<Article> => {
  const { id } = params;
  const userId = params.user?.id || undefined;

  const article = await $Article.findOne({
    _id: id,
    $or: [
      { status: ArticleStatus.public },
      { createdBy: userId },
    ],
  }).populate('createdBy', '-password');

  if (!article) throw response.NO(404, 'Entity not found');

  return article;
};

interface GetArticlesAndCountParams {
  findKey: string|string[];
  findValue: string;
  articleStatus?: ArticleStatus|string;
  articleType?: ArticleType|string;
  createdBy?: string;
  tag: string;
  user?: SafeUser;
  pagination: WithPagination;
}

interface GetArticlesAndCount {
  (params: GetArticlesAndCountParams): Promise<[Article[], number]>
}
export const getArticlesAndCount: GetArticlesAndCount = async params => {
  const {
    findKey,
    findValue,
    articleStatus,
    articleType,
    createdBy,
    tag,
    pagination,
  } = params;

  // const tagQuery = await $ArticleTag.getQueryToGetEntitiesOfTag(tag);

  const user = params.user?.id || undefined;

  const query = {
    $and: [
      useQuery.optionals({ tags: tag }),
      useQuery.findByString(findKey, findValue),
      useQuery.optionals({ articleType }),
      useQuery.optionals({
        $or: [
          { status: ArticleStatus.public },
          { createdBy: user },
        ],
      }),
    ],
  };

  const entities = await pagination($Article
    .find(query)
    .populate('createdBy', '-password'));
    // .populate('tags')

  const count = await $Article.countDocuments(query);

  return [
    entities,
    count,
  ];
};

type UpdateData = Omit<Article, 'createdBy'|'createdAt'|'publishedAt'|'updatedAt'>;
interface UpdateArticleInterface {
  id: string;
  data: UpdateData;
  user?: SafeUser;
}
export const updateArticle = async (params: UpdateArticleInterface): Promise<Article> => {
  const {
    id,
    user,
    data,
  } = params;

  const article = await getOneArticle({ id, user });
  if (!article) throw response.NO(404, 'Entity not found');

  if (!isEqualID(article.createdBy?.id, user?.id, true)) throw response.NO(403, 'Not your entity');

  // 태그가 다 유효한지 확인
  // const tags = data.tags.map()

  // const tags = await $ArticleTag.registerTags(
  //   data.tags.filter(Boolean) as any,
  //   user,
  // );

  // console.log(tags);

  const result = await $Article.findOneAndUpdate({ _id: id }, useQuery.optionals({
    title: data.title,
    content: data.content,
    status: optionalEnum<ArticleStatus>(ArticleStatus, data.status),
    articleType: optionalEnum<ArticleType>(ArticleType, data.articleType),
    contentType: optionalEnum<ContentType>(ContentType, data.contentType),
    tags: data.tags, // tags.filter(Boolean),
  }));

  if (!result) throw response.NO(500, 'Update failed', result);

  return result;
};

// voteUps
// voteDowns
interface VoteArticleParams {
  id: string;
  user: USER;
  voteType: string;
  voteMethod: string;
}
export const voteArticle = async (params: VoteArticleParams): Promise<boolean> => {
  const {
    id, user, voteType, voteMethod,
  } = params;

  const article = await getOneArticle({ id });

  const nextPayload = vote<Article>({
    entity: article,
    user,
    voteType,
    voteMethod,
  });

  const result = await $Article.updateOne({ _id: id }, nextPayload);

  if (!result.ok) throw response.NO(500, 'Update failed', result);

  return !!result.nModified;
};

interface DeleteArticleInterface {
  id: string;
  user?: SafeUser;
}
export const deleteArticle = async (params: DeleteArticleInterface): Promise<boolean> => {
  const {
    id,
    user,
  } = params;

  const article = await getOneArticle({ id, user });
  if (!article) throw response.NO(404, 'Entity not found');
  if (!isEqualID(article.createdBy.id, user?.id)) throw response.NO(403, 'Not your entity');
  const result = await $Article.deleteOne({ _id: id });
  if (!result.deletedCount) throw response.NO(500, 'Delete failed', result);
  return true;
};
