import {
  PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, Column,
} from 'typeorm';

export class StandardEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @Column({
    nullable: true,
  })
  extraData: string;
}
