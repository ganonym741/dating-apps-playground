import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  UpdateDateColumn,
  CreateDateColumn,
  BeforeInsert,
  BeforeUpdate,
  AfterLoad,
  DeleteDateColumn,
} from 'typeorm';

import { ApiProperty } from '@nestjs/swagger';

import * as bcrypt from 'bcrypt';
import { Exclude } from 'class-transformer';

import { DefaultEntity } from '@model/default.entity';
import { CryptService } from '@core/utils/encryption';

export enum GENDER {
  'Male',
  'Female',
}

export enum MEMBERSHIP {
  'Basic',
  'Premium',
}

@Entity('user')
export class UserEntity extends DefaultEntity {
  @Exclude({ toPlainOnly: true })
  private tempPassword: string;

  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ApiProperty({ example: 'Nama User' })
  @Column()
  name: string;

  @ApiProperty({ example: 'email@example.com' })
  @Column({ unique: true })
  email: string;

  @ApiProperty({ example: 'Username' })
  @Column({ unique: true, nullable: true })
  username: string;

  @ApiProperty({ example: 'Password' })
  @Column({ select: false })

  // @Exclude({ toPlainOnly: true })
  password: string;

  @ApiProperty({ example: '12-07-1990' })
  @Column()
  birth_date: Date;

  @ApiProperty({ example: 'M' })
  @Column()
  gender: GENDER;

  @ApiProperty({ example: 'address' })
  @Column()
  address: string;

  @ApiProperty({ example: 'M' })
  @Column()
  photo: string;

  @ApiProperty({ example: 'Deskripsi profile' })
  @Column('text', { nullable: true })
  profile_desc: string;

  @ApiProperty({ example: 'Phone Number' })
  @Column({ nullable: true, unique: true })
  phone_number: string;

  @ApiProperty({ example: 'basic | premium' })
  @Column()
  membership: MEMBERSHIP;

  @CreateDateColumn({ type: 'timestamptz', default: () => 'CURRENT_TIMESTAMP' })
  created_at: Date;

  @UpdateDateColumn({ type: 'timestamptz', default: () => 'CURRENT_TIMESTAMP' })
  updated_at: Date;

  @DeleteDateColumn({ type: 'timestamptz', default: () => 'CURRENT_TIMESTAMP' })
  deleted_at: Date;

  @BeforeInsert()
  async hashPassword() {
    if (this.password) {
      const enc = CryptService.decrypt(this.password);

      this.password = await bcrypt.hash(enc, 10);
    }
  }

  @AfterLoad()
  private loadTempPassword(): void {
    this.tempPassword = this.password;
  }

  @BeforeUpdate()
  async updateHassPassword() {
    if (this.tempPassword !== this.password) {
      const enc = CryptService.decrypt(this.password);

      this.password = await bcrypt.hash(enc, 10);
    }
  }
}
