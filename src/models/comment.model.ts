import { User } from '@models/user.model';
import { Post } from '@models/post.model';
import { Entity, EntitySchema } from '@/models/entity.model';
import { Schema, Document, model } from 'mongoose';

const ID = Schema.Types.ObjectId;

export interface Comment extends Entity {
  content: string;
  post: Post;
}

const CommentSchema = new Schema<Comment>({
  ...EntitySchema,
  content: { type: String },
  post: { type: ID, ref: 'Post' },
});

export default model<Comment>('Comment', CommentSchema);
