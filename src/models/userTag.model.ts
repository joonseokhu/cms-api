import { User } from '@models/user.model';
import { Schema, Document, model } from 'mongoose';

const ID = Schema.Types.ObjectId;

export interface UserTag extends Document {
  name: string;
  description: string;
  users: User[];
}

const UserTagSchema = new Schema<UserTag>({
  name: { type: String, required: true, unique: true },
  description: { type: String },
  users: [{ type: ID, ref: 'User' }],
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
