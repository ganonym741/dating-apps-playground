import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  UpdateDateColumn,
  CreateDateColumn,
  JoinColumn,
  ManyToOne,
  DeleteDateColumn,
} from 'typeorm';

import { ApiProperty } from '@nestjs/swagger';

import { UserEntity } from './user.entity';

@Entity('album')
export class AlbumEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ApiProperty({ example: 'https://photo_1' })
  @Column()
  user_id: string;

  @ApiProperty({ title: 'UUID Agent' })
  @ManyToOne(() => UserEntity, { nullable: false })
  @JoinColumn({ name: 'user_id' })
  agent: UserEntity;

  @ApiProperty({ example: 'https://photo_1' })
  @Column()
  photo_1: string;

  @ApiProperty({ example: 'https://photo_2' })
  @Column({ nullable: true })
  photo_2: string;

  @ApiProperty({ example: 'https://photo_3' })
  @Column({ nullable: true })
  photo_3: string;

  @ApiProperty({ example: 'https://photo_4' })
  @Column({ nullable: true })
  photo_4: string;

  @ApiProperty({ example: 'https://photo_5' })
  @Column({ nullable: true })
  photo_5: string;

  @ApiProperty({ example: 'Deskripsinya kalau ada' })
  @Column('text', { nullable: true })
  descriptions: string;

  @ApiProperty({ example: 'Total like' })
  @Column({ type: 'int', default: 0 })
  like: number;

  @CreateDateColumn({ type: 'timestamptz', default: () => 'CURRENT_TIMESTAMP' })
  created_at: Date;

  @UpdateDateColumn({ type: 'timestamptz', default: () => 'CURRENT_TIMESTAMP' })
  updated_at: Date;

  @DeleteDateColumn({ type: 'timestamptz', default: () => 'CURRENT_TIMESTAMP' })
  deleted_at: Date;
}
