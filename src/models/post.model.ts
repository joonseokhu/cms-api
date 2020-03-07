import {
  Entity, Column, ManyToMany,
} from 'typeorm';
import { PostStatus, PostType, ContentType } from '@interfaces/post.interfaces';
import { StandardEntity } from '@/models/standard';
import { Tag } from './tag.model';

@Entity()
export class Post extends StandardEntity {
  @Column({
    default: PostStatus.draft,
  })
  postStatus: PostStatus;

  @Column({
    default: PostType.ordinary,
  })
  postType: PostType;

  @Column({
    nullable: true,
  })
  title: string;

  @Column({
    default: ContentType.plainText,
  })
  contentType: ContentType;

  @Column({
    type: 'varchar',
    length: 1000,
    nullable: true,
  })
  content: string;

  @ManyToMany(type => Tag, tag => tag.posts)
  tags: Tag[];
}
