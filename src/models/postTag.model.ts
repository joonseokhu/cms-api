import {
  Entity, Column, ManyToMany, JoinTable,
} from 'typeorm';
import { StandardEntity } from '@/models/standard';
import { Post } from './post.model';

@Entity()
export class PostTag extends StandardEntity {
  @Column({
    unique: true,
  })
  name: string;

  @Column()
  description: string;

  @ManyToMany(type => Post, post => post.tags)
  @JoinTable()
  posts: Post[];
}
