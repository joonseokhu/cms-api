import {
  PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn,
  Entity, Column, ManyToMany, OneToOne, JoinColumn, OneToMany,
} from 'typeorm';
import { StandardEntity } from '@models/standard';
import { UserProfile } from '@models/userProfile.model';
import { UserTag } from '@models/userTag.model';
import { UserStatus } from '../interfaces/user.interfaces';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    default: UserStatus.draft,
  })
  status: UserStatus;

  @Column()
  email: string;

  @Column({
    select: false,
  })
  password: string;

  @Column({
    unique: true,
  })
  username: string;

  @CreateDateColumn()
  registeredAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @Column({
    type: 'datetime',
    default: () => 'CURRENT_TIMESTAMP',
  })
  passwordUpdatedAt: Date;

  @Column({
    nullable: true,
  })
  resignedAt: Date;

  @OneToOne(type => UserProfile)
  @JoinColumn()
  profile: UserProfile;

  @ManyToMany(type => UserTag, userTag => userTag.users)
  tags: UserTag[];
}
