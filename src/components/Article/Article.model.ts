import { User } from '@/components/User/User.model';
import { Schema, Document, model } from 'mongoose';
import { PostStatus, PostType, ContentType } from '@interfaces/post.interfaces';
import { PostTag } from '@/models/ArticleTag.model';
import { Entity, EntitySchema } from '@/models/UserContent.model';

const ID = Schema.Types.ObjectId;

export interface Post extends Entity {
  title: string;
  content: string;
  status: PostStatus;
  postType: PostType;
  contentType: ContentType;
  tags: PostTag[];
  publishedAt: Date;
}

const PostSchema = new Schema<Post>({
  ...EntitySchema,
  title: { type: String },
  content: { type: String },
  status: { type: String, default: PostStatus.draft },
  postType: { type: String, default: PostType.ordinary },
  contentType: { type: String, default: ContentType.plainText },
  tags: [{ type: ID, ref: 'PostTag' }],
  publishedAt: { type: Date },
});

export default model<Post>('Post', PostSchema);

// import {
//   Entity, Column, ManyToMany, ManyToOne,
// } from 'typeorm';
// import { PostStatus, PostType, ContentType } from '@interfaces/post.interfaces';
// import { StandardEntity } from '@models/standard';
// import { User } from '@models/user.model';
// import { PostTag } from '@models/postTag.model';

// @Entity()
// export class Post extends StandardEntity {
//   @Column({
//     default: PostStatus.draft,
//   })
//   postStatus: PostStatus;

//   @Column({
//     default: PostType.ordinary,
//   })
//   postType: PostType;

//   @Column({
//     nullable: true,
//   })
//   title: string;

//   @Column({
//     default: ContentType.plainText,
//   })
//   contentType: ContentType;

//   @Column({
//     type: 'datetime',
//     nullable: true,
//   })
//   publishedAt: Date;

//   @Column({
//     type: 'varchar',
//     length: 1000,
//     nullable: true,
//   })
//   content: string;

//   @ManyToOne(type => User)
//   user: User;

//   @ManyToMany(type => PostTag, tag => tag.posts)
//   tags: PostTag[];
// }
