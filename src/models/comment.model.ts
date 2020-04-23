import { User } from '@models/user.model';
import { Schema, Document, model } from 'mongoose';

const ID = Schema.Types.ObjectId;

export interface Comment extends Document {
  content: string;
  voteUps: User[];
  voteDowns: User[];
  createdBy: User;
  createdAt: Date;
  updatedAt: Date;
}

const CommentSchema = new Schema<Comment>({
  content: { type: String },
  voteUps: [{ type: ID, ref: 'User' }],
  voteDowns: [{ type: ID, ref: 'User' }],
  createdBy: { type: ID, ref: 'User', required: true },
  createdAt: { type: Date, default: Date.now() },
  updatedAt: { type: Date, default: Date.now() },
});

export default model<Comment>('Comment', CommentSchema);
