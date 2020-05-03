import { User } from '@/components/User/model';
import { Schema, Document, model } from 'mongoose';

const ID = Schema.Types.ObjectId;

export interface UserTag extends Document {
  name: string;
  description: string;
  users: User[];
  createdBy: User;
  createdAt: Date,
  updatedAt: Date,
}

const UserTagSchema = new Schema<UserTag>({
  name: { type: String, required: true, unique: true },
  description: { type: String },
  users: [{ type: ID, ref: 'User' }],
  createdBy: { type: ID, ref: 'User', required: true },
  createdAt: { type: Date, default: Date.now() },
  updatedAt: { type: Date, default: Date.now() },
});

export default model<UserTag>('UserTag', UserTagSchema);
