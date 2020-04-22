import { User } from '@models/user.model';
import { Schema, Document, model } from 'mongoose';

const ID = Schema.Types.ObjectId;

export interface Post extends Document {
  content: string;
  voteUps: User[];
  voteDowns: User[];
  createdBy: User;
  createdAt: Date;
  publishedAt: Date;
  updatedAt: Date;
}

const PostSchema = new Schema<Post>({
  content: { type: String },
  voteUps: [{ type: ID, ref: 'User' }],
  voteDowns: [{ type: ID, ref: 'User' }],
  createdBy: { type: ID, ref: 'User', required: true },
  createdAt: { type: Date, default: Date.now() },
  updatedAt: { type: Date, default: Date.now() },
  publishedAt: { type: Date },
});

export default model<Post>('Post', PostSchema);
