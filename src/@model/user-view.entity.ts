import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  JoinColumn,
  ManyToOne,
  DeleteDateColumn,
} from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';

import { UserEntity } from './user.entity';

@Entity('user-view')
export class UserViewEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ApiProperty({ example: 'xxxxx' })
  @Column()
  user_id: string;

  @ApiProperty({ title: 'UUID User' })
  @ManyToOne(() => UserEntity, { nullable: false })
  @JoinColumn({ name: 'user_id' })
  user: UserEntity;

  @ApiProperty({ example: 'xxxxx' })
  @Column()
  viewed_by_id: string;

  @ApiProperty({ title: 'UUID User' })
  @ManyToOne(() => UserEntity, { nullable: false })
  @JoinColumn({ name: 'viewed_by_id' })
  viewed_by: UserEntity;

  @CreateDateColumn({ type: 'timestamptz', default: () => 'CURRENT_TIMESTAMP' })
  created_at: Date;

  @DeleteDateColumn({ type: 'timestamptz' })
  deleted_at: Date;
}
