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
import { IsDateString, IsEmail, IsEnum, Matches } from 'class-validator';

import { PASSSWORD_REGEX } from '@core/utils/const';

export enum GENDER {
  'Male' = 'Male',
  'Female' = 'Female',
}

export enum MEMBERSHIP {
  'Basic' = 'Basic',
  'Premium' = 'Premium',
}

@Entity('user')
export class UserEntity {
  @Exclude({ toPlainOnly: true })
  private tempPassword: string;

  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ApiProperty({ example: 'Nama User' })
  @Column()
  name: string;

  @ApiProperty({ example: 'email@example.com' })
  @Column({ unique: true })
  @IsEmail({}, {message: 'Email tidak valid'})
  email: string;

  @ApiProperty({ example: 'Username' })
  @Column({ unique: true, nullable: true })
  username: string;

  @ApiProperty({ example: 'Password' })
  @Column({ select: false })
  @Matches(PASSSWORD_REGEX, {message: 'Password harus lebih dari 12 karakter, memiliki minimal 1 huruf kapital, 1 simbol, dan 1 angka.'})
  password: string;

  @ApiProperty({ example: '12-07-1990' })
  @Column()
  @IsDateString({},{message: 'Tanggal lahir tidak valid'})
  birth_date: Date;

  @ApiProperty({ example: 'M' })
  @Column()
  @IsEnum(GENDER, {message: 'Jenis Kelamin tidak valid'})
  gender: GENDER;

  @ApiProperty({ example: 'address' })
  @Column()
  address: string;

  @ApiProperty({ example: 'city' })
  @Column()
  city: string;

  @ApiProperty({ example: 'province' })
  @Column()
  province: string;

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
  @IsEnum(MEMBERSHIP, {message: 'Membership tidak valid'})
  membership: MEMBERSHIP;

  @CreateDateColumn({ type: 'timestamptz', default: () => 'CURRENT_TIMESTAMP' })
  created_at: Date;

  @UpdateDateColumn({ type: 'timestamptz', default: () => 'CURRENT_TIMESTAMP' })
  updated_at: Date;

  @DeleteDateColumn({ type: 'timestamptz' })
  deleted_at: Date;

  @BeforeInsert()
  async hashPassword() {
    if (this.password) {
      this.password = await bcrypt.hash(this.password, 10);
    }
  }

  @AfterLoad()
  private loadTempPassword(): void {
    this.tempPassword = this.password;
  }

  @BeforeUpdate()
  async updateHassPassword() {    
    if (this.tempPassword !== this.password) {
      this.password = await bcrypt.hash(this.password, 10);
    }
  }
}
