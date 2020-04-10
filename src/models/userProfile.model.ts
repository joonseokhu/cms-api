import {
  Entity, Column, ManyToMany, OneToOne,
} from 'typeorm';
import { StandardEntity } from '@/models/standard';
// import { Tag } from '../tag/tag.model';

@Entity()
export class UserProfile extends StandardEntity {
  @Column({
    nullable: true,
  })
  givenName: string;

  @Column({
    nullable: true,
  })
  familyName: string;

  @Column({
    nullable: true,
  })
  nickname: string;

  @Column({
    nullable: true,
  })
  persona: string;

  @Column({
    nullable: true,
  })
  description: string;
}
