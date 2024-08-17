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
import { AlbumEntity } from './album.entity';

@Entity('album-like')
export class AlbumLikeEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ApiProperty({ example: 'xxxxx' })
  @Column()
  album_id: string;

  @ApiProperty({ title: 'UUID Album' })
  @ManyToOne(() => AlbumEntity, { nullable: false })
  @JoinColumn({ name: 'album_id' })
  album: AlbumEntity;

  @ApiProperty({ example: 'xxxxx' })
  @Column()
  liked_by_id: string;

  @ApiProperty({ title: 'UUID User' })
  @ManyToOne(() => UserEntity, { nullable: false })
  @JoinColumn({ name: 'liked_by_id' })
  liked_by: UserEntity;

  @CreateDateColumn({ type: 'timestamptz', default: () => 'CURRENT_TIMESTAMP' })
  created_at: Date;

  @DeleteDateColumn({ type: 'timestamptz' })
  deleted_at: Date;
}
