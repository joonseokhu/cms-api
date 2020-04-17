import { User } from '@models/user.model';
import { Schema, Document, model } from 'mongoose';

const ID = Schema.Types.ObjectId;

export interface UserProfile extends Document {
  givenName: string;
  familyName: string;
  nickName: string;
  persona: string;
  description: string;
  updatedAt: Date;
}

const UserProfileSchema = new Schema<UserProfile>({
  givenName: { type: String },
  familyName: { type: String },
  nickName: { type: String },
  persona: { type: String },
  description: { type: String },
  updatedAt: { type: Date, default: Date.now() },
});

export default model<UserProfile>('UserProfile', UserProfileSchema);

// import {
//   PrimaryGeneratedColumn, UpdateDateColumn,
//   Entity, Column, ManyToMany, OneToOne,
// } from 'typeorm';
// import { StandardEntity } from '@models/standard';
// // import { Tag } from '../tag/tag.model';

// @Entity()
// export class UserProfile {
//   @PrimaryGeneratedColumn()
//   id: number;

//   @Column({
//     nullable: true,
//   })
//   givenName: string;

//   @Column({
//     nullable: true,
//   })
//   familyName: string;

//   @Column({
//     nullable: true,
//   })
//   nickname: string;

//   @Column({
//     nullable: true,
//   })
//   persona: string;

//   @Column({
//     nullable: true,
//   })
//   description: string;

//   @UpdateDateColumn()
//   updatedAt: Date;
// }
