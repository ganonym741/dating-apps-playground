import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { AlbumService } from './album.service';
import { AlbumController } from './album.controller';
import { AlbumEntity } from '@model/album.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([AlbumEntity]),
  ],
  controllers: [AlbumController],
  providers: [AlbumService],
})
export class AlbumModule {}
