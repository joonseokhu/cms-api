import {
  Entity, Column, ManyToMany, OneToOne,
} from 'typeorm';
import { StandardEntity } from '@models/standard';
import { User } from '@models/user.model';
// import { Tag } from '../tag/tag.model';

@Entity()
export class UserTag extends StandardEntity {
  @Column({
    unique: true,
  })
  name: string;

  @Column()
  description: string;

  @ManyToMany(type => User, user => user.tags)
  users: User[];
}
