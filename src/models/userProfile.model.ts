import {
  PrimaryGeneratedColumn, UpdateDateColumn,
  Entity, Column, ManyToMany, OneToOne,
} from 'typeorm';
import { StandardEntity } from '@/models/standard';
// import { Tag } from '../tag/tag.model';

@Entity()
export class UserProfile {
  @PrimaryGeneratedColumn()
  id: number;

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

  @UpdateDateColumn()
  updatedAt: Date;
}
