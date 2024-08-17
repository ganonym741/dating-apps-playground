import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import type { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';

import { UserEntity } from '@model/user.entity';
import { UserSeed } from '@/migrations/seeds/user.seeds';

@Injectable()
export class Seeder {
  constructor(
    @InjectRepository(UserEntity) private userRepo: Repository<UserEntity>
  ) {}

  async createDummyUser() {
    try {
      for (const dataUnit of UserSeed) {
        dataUnit.password = await bcrypt.hash(dataUnit.password, 10);
        await this.userRepo.insert(dataUnit);
      }
    } catch (error: any) {
      console.log('Create Dummy User Failed. Detail: ', error.message);
    }
  }
}
