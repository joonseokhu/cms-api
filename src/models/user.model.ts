// import {
//   PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn,
//   Entity, Column, ManyToMany, OneToOne, JoinColumn, OneToMany,
// } from 'typeorm';

import { UserProfile } from '@models/userProfile.model';
import { UserTag } from '@models/userTag.model';
import { Schema, Document, model } from 'mongoose';
import { UserStatus } from '../interfaces/user.interfaces';

const ID = Schema.Types.ObjectId;

export interface User extends Document {
  username: string;
  email: string;
  password: string;
  status: UserStatus;
  tags: UserTag[];
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

export default model<User>('User', UserSchema);

// @Entity()
// export class User {
//   @PrimaryGeneratedColumn()
//   id: number;

//   @Column({
//     default: UserStatus.draft,
//   })
//   status: UserStatus;

//   @Column()
//   email: string;

//   @Column({
//     select: false,
//   })
//   password: string;

//   @Column({
//     unique: true,
//   })
//   username: string;

//   @CreateDateColumn()
//   registeredAt: Date;

//   @UpdateDateColumn()
//   updatedAt: Date;

//   @Column({
//     type: 'datetime',
//     default: () => 'CURRENT_TIMESTAMP',
//   })
//   passwordUpdatedAt: Date;

//   @Column({
//     nullable: true,
//   })
//   resignedAt: Date;

//   @OneToOne(type => UserProfile)
//   @JoinColumn()
//   profile: UserProfile;

//   @ManyToMany(type => UserTag, userTag => userTag.users)
//   tags: UserTag[];
// }
