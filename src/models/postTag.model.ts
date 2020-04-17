import { User } from '@models/user.model';
import { Schema, Document, model } from 'mongoose';
import { PostStatus, PostType, ContentType } from '@interfaces/post.interfaces';
import { Post } from '@models/post.model';

const ID = Schema.Types.ObjectId;

export interface PostTag extends Document {
  name: string;
  description: string;
  posts: Post[];
}

const PostTagSchema = new Schema<PostTag>({
  name: { type: String, required: true, unique: true },
  description: { type: String },
  posts: [{ type: ID, ref: 'Post' }],
});

export default model<PostTag>('PostTag', PostTagSchema);

// import {
//   Entity, Column, ManyToMany, JoinTable,
// } from 'typeorm';
// import { StandardEntity } from '@models/standard';
// import { Post } from './post.model';

// @Entity()
// export class PostTag extends StandardEntity {
//   @Column({
//     unique: true,
//   })
//   name: string;

//   @Column()
//   description: string;

//   @ManyToMany(type => Post, post => post.tags)
//   @JoinTable()
//   posts: Post[];
// }
