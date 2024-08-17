import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import type { Repository } from 'typeorm';

import { UserSeed } from 'migration/seeds/user.seeds';
import { UserEntity } from '@/@model/user.entity';

@Injectable()
export class Seeder {
  constructor(
    @InjectRepository(UserEntity) private userRepo: Repository<UserEntity>
  ) {}

  async createDummyUser() {
    try {
      for (const dataUnit of UserSeed) {
        await this.userRepo.insert(dataUnit);
      }
    } catch (error: any) {
      console.log('Create Dummy User Failed. Detail: ', error.message);
    }
  }
}
