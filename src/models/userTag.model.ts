import { User } from '@models/user.model';
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

// import {
//   Entity, Column, ManyToMany, OneToOne,
// } from 'typeorm';
// import { StandardEntity } from '@models/standard';
// import { User } from '@models/user.model';
// // import { Tag } from '../tag/tag.model';

// @Entity()
// export class UserTag extends StandardEntity {
//   @Column({
//     unique: true,
//   })
//   name: string;

//   @Column()
//   description: string;

//   @ManyToMany(type => User, user => user.tags)
//   users: User[];
// }
