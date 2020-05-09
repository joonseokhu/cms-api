import { User } from '@/components/User/model';
import { Schema, Document, model } from 'mongoose';
import { ArticleStatus, ArticleType, ContentType } from '@/components/Article/interfaces';
// import { ArticleTag } from '@/components/Tag/ArticleTag.model';
import { Tag } from '@components/Tag/model';
import TagModel from '@components/Tag/services';
import { Entity, EntitySchema } from '@/components/UserContent/model';

const ID = Schema.Types.ObjectId;

export interface Article extends Entity {
  title: string;
  content: string;
  status: ArticleStatus;
  articleType: ArticleType;
  contentType: ContentType;
  tags: Tag<Article>[];
  publishedAt: Date;
}

const ArticleSchema = new Schema<Article>({
  ...EntitySchema,
  title: { type: String },
  content: { type: String },
  status: { type: String, default: ArticleStatus.draft },
  articleType: { type: String, default: ArticleType.ordinary },
  contentType: { type: String, default: ContentType.plainText },
  tags: [{ type: String, ref: 'ArticleTag' }],
  publishedAt: { type: Date },
});

export const $Article = model<Article>('Article', ArticleSchema);

export const $ArticleTag = new TagModel('ArticleTag', {
  name: 'Article',
  model: $Article,
});

export default $Article;
