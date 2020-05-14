// import {
//   PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn,
//   Entity, Column, ManyToMany, OneToOne, JoinColumn, OneToMany,
// } from 'typeorm';

import { UserProfile } from '@/components/User/UserProfile.model';
import { Tag } from '@components/Tag/model';
import TagModel from '@components/Tag/services';
import { Schema, Document, model } from 'mongoose';
import { UserStatus } from './interfaces';

const ID = Schema.Types.ObjectId;

export interface User extends Document {
  username: string;
  email: string;
  password: string;
  status: UserStatus;
  tags: Tag<User>[];
  profile: UserProfile;
  registeredAt: Date;
  passwordUpdatedAt: Date;
  resignedAt: Date;
}

export type SafeUser = Omit<User, 'password'>;

const UserSchema = new Schema<User>({
  username: { type: String, required: true },
  email: { type: String, required: true },
  password: { type: String, required: true },
  status: { type: String, default: UserStatus.registered },
  tags: [{ type: ID, ref: 'UserTag' }],
  profile: { type: ID, ref: 'UserProfile' },
  registeredAt: { type: Date, default: Date.now() },
  passwordUpdatedAt: { type: Date, default: Date.now() },
  resignedAt: { type: Date },
});

export const $User = model<User>('User', UserSchema);

export const $UserTag = new TagModel({
  name: 'UserTag',
  entityName: 'User',
  entityModel: $User,
});

export default $User;
