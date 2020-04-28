import { Document, Schema } from 'mongoose';
import { User } from '@models/user.model';

const ID = Schema.Types.ObjectId;

export interface Entity extends Document {
  voteUps: User[];
  voteDowns: User[];
  createdBy: User;
  createdAt: Date;
  updatedAt: Date;
}

export const EntitySchema = {
  voteUps: [{ type: ID, ref: 'User' }],
  voteDowns: [{ type: ID, ref: 'User' }],
  createdBy: { type: ID, ref: 'User', required: true },
  createdAt: { type: Date, default: Date.now() },
  updatedAt: { type: Date, default: Date.now() },
};
