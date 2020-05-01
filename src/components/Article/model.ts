import { User } from '@/components/User/model';
import { Schema, Document, model } from 'mongoose';
import { PostStatus, PostType, ContentType } from '@/components/Article/interfaces';
import { PostTag } from '@/components/Tag/ArticleTag.model';
import { Entity, EntitySchema } from '@/components/UserContent/model';

const ID = Schema.Types.ObjectId;

export interface Post extends Entity {
  title: string;
  content: string;
  status: PostStatus;
  postType: PostType;
  contentType: ContentType;
  tags: PostTag[];
  publishedAt: Date;
}

const PostSchema = new Schema<Post>({
  ...EntitySchema,
  title: { type: String },
  content: { type: String },
  status: { type: String, default: PostStatus.draft },
  postType: { type: String, default: PostType.ordinary },
  contentType: { type: String, default: ContentType.plainText },
  tags: [{ type: ID, ref: 'PostTag' }],
  publishedAt: { type: Date },
});

export default model<Post>('Post', PostSchema);
