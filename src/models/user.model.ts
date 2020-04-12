import {
  Entity, Column, ManyToMany, OneToOne, JoinColumn,
} from 'typeorm';
import { StandardEntity } from '@models/standard';
import { UserProfile } from '@models/userProfile.model';
import { UserTag } from '@models/userTag.model';
import { UserStatus } from '../interfaces/user.interfaces';

@Entity()
export class User extends StandardEntity {
  @Column({
    default: UserStatus.draft,
  })
  status: UserStatus;

  @Column()
  email: string;

  @Column()
  password: string;

  @Column({
    unique: true,
  })
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

  @OneToOne(type => UserProfile)
  @JoinColumn()
  profile: UserProfile;

  @ManyToMany(type => UserTag, userTag => userTag.users)
  tags: UserTag[];
}
