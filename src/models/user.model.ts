import {
  Entity, Column, ManyToMany, OneToOne,
} from 'typeorm';
import { StandardEntity } from '@/models/standard';
import { UserStatus } from '../interfaces/user.interfaces';
// import { Tag } from '../tag/tag.model';

@Entity()
export class User extends StandardEntity {
  @Column({
    default: UserStatus.draft,
  })
  UserStatus: UserStatus;

  @Column()
  email: string;

  @Column()
  password: string;

  @Column()
  username: string;

  @Column({
    type: 'datetime',
    default: () => 'CURRENT_TIMESTAMP',
  })
  passwordUpdatedAt: Date;

  @Column({
    nullable: true,
  })
  resignedAt: Date;

  // @ManyToMany(type => Tag, tag => tag.posts)
  // tags: Tag[];
}
