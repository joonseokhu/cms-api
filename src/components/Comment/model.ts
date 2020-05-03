import { User } from '@/components/User/model';
import { Article } from '@/components/Article/model';
import { Entity, EntitySchema } from '@/components/UserContent/model';
import { Schema, Document, model } from 'mongoose';

const ID = Schema.Types.ObjectId;

export interface Comment extends Entity {
  content: string;
  article: Article;
}

const CommentSchema = new Schema<Comment>({
  ...EntitySchema,
  content: { type: String },
  article: { type: ID, ref: 'Article' },
});

export default model<Comment>('Comment', CommentSchema);
