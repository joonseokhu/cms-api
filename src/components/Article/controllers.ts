import * as articleService from '@/components/Article/services';

import { $ArticleTag, $ArticleFile } from '@components/Article/model';
import {
  Controller, validate, authorize, useControl,
} from '@/api';

export const createDraftArticle = Controller([], async (req, OK, NO) => {
  const article = await articleService.createArticle({ user: req.user });
  return OK(article);
});

export const getOneArticle = Controller([], async (req, OK, NO) => {
  const { id } = req.params;
  const article = await articleService.getOneArticle({ id, user: req.user });
  return OK(article);
});

export const getAllArticles = Controller([
  validate(
    validate.pagination(),
    validate.findByString(
      'title',
      ['title', 'content'],
    ),
    validate.query('tag').optional().isLength({ min: 2 }),
  ),
], async (req, OK, NO) => {
  console.log('req.query', req.query);
  const { user } = req;
  const {
    findKey,
    findValue,
    articleStatus,
    articleType,
    createdBy,
    tag,
  } = (req.query as any);
  /**
   * @todo 쿼리 타입 맞춰줘야함
   */
  const [entities, count] = await articleService.getArticlesAndCount({
    findKey,
    findValue,
    articleStatus,
    articleType,
    createdBy,
    tag,
    user,
    pagination: useControl.pagination(req),
  });
  return OK({ entities, count });
});

export const voteArticle = Controller([
  authorize(
    authorize.hasAuth(true),
  ),
  validate(
    validate.param('id').isMongoId(),
    validate.param('vote').isIn(['up', 'down']),
  ),
], async (req, OK, NO) => {
  const result = await articleService.voteArticle({
    user: req.user,
    id: req.params.id,
    voteType: req.params.vote,
    voteMethod: req.method,
  });
  return OK(result);
});

export const updateArticle = Controller([], async (req, OK, NO) => {
  const { id } = req.params;
  const { body: data, user } = req;
  const result = await articleService.updateArticle({ id, data, user });
  return OK(result);
});

export const deleteArticle = Controller([], async (req, OK, NO) => {
  const { id } = req.params;
  const _ = await articleService.deleteArticle({ id, user: req.user });
  const fileDeleteResult = await $ArticleFile.deleteFilesOfEntity(id);
  return OK(fileDeleteResult);
});

export const uploadArticleFile = Controller([], async (req, OK, NO) => {
  const { articleID } = req.params;
  const result = await $ArticleFile.createFile(req, articleID);
  return OK(result);
});

export const deleteArticleFile = Controller([], async (req, OK, NO) => {
  const { fileID } = req.params;
  const result = await $ArticleFile.deleteFile(fileID);
  return OK(result);
});

export const createArticleTag = Controller([
  authorize(
    authorize.hasAuth(true),
  ),
  validate(
    validate.body('name').isLength({ min: 2 }),
  ),
], async (req, OK, NO) => {
  const tag = await $ArticleTag.createTag({
    name: req.body.name,
    description: req.body.description,
    user: req.user,
  });
  return OK(tag);
});

export const getArticleTags = Controller([
  validate(
    validate.query('name').optional().isLength({ min: 2 }),
  ),
], async (req, OK, NO) => {
  const [entities, count] = await $ArticleTag.getAllTags(req.query.name as string);

  return OK({
    entities,
    count,
  });
});

// export const getTagsOfArticle = Controller([
//   validate(
//     validate.param('id').optional().isMongoId(),
//   ),
// ], async (req, OK, NO) => {
//   const [entities, count] = await $ArticleTag.getTagsOfEntity(req.params.id);

//   return OK({
//     entities,
//     count,
//   });
// });
