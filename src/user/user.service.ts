import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, MoreThan, Not, type Repository } from 'typeorm';

import type { CreateUserDto } from './dto/create-user.dto';
import type { UpdateUserDto } from './dto/update-user.dto';
import { UserEntity } from '@model/user.entity';
import type { GetManyUserDto } from './dto/get-user.dto';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(UserEntity) private userRepo: Repository<UserEntity>
  ) {}

  async create(createUserDto: CreateUserDto) {
    const result = await this.userRepo.save(createUserDto);

    if (result.id) return 'Registrasi user sukses';
  }

  async findAll(params: GetManyUserDto, except: string[] = []) {
    const result = await this.userRepo.find({
      where: {
        ...(params.gender && { gender: params.gender }),
        ...(params.maxAge && {
          birth_date: MoreThan(
            new Date(
              new Date().setFullYear(new Date().getFullYear() - params.maxAge)
            )
          ),
        }),
        ...(params.city && { city: params.city }),
        ...(params.province && { province: params.province }),
        id: Not(In([except])),
      },
      take: 10,
    });

    return result;
  }

  async findOne(id: string) {
    return await this.userRepo.findOne({
      where: { id: id },
      select: { created_at: false, updated_at: false, deleted_at: false },
    });
  }

  async update(id: string, updateUserDto: UpdateUserDto) {
    const result = (await this.userRepo.update({ id: id }, updateUserDto))
      .affected;

    if (result === 0) {
      throw new NotFoundException('User tidak ditemukan');
    } else {
      return 'Data user berhasil di update';
    }
  }

  async remove(id: string) {
    const result = (await this.userRepo.delete({ id: id })).affected;

    if (result === 0) {
      throw new NotFoundException('User tidak ditemukan');
    } else {
      return 'User berhasil di hapus';
    }
  }
}
