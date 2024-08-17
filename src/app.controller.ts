import type { OnApplicationBootstrap } from '@nestjs/common';
import { Controller } from '@nestjs/common';

import type { Seeder } from './seeds/seeds.service';

@Controller()
export class AppController implements OnApplicationBootstrap {
  constructor(public seeder: Seeder) {}

  async onApplicationBootstrap() {
    // this.connect();
    await this.seeder.createDummyUser();
  }
}
