import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { UserActionService } from './user-action.service';
import { UserActionController } from './user-action.controller';
import { UserLikeEntity } from '@/@model/user-like.entity';
import { UserViewEntity } from '@/@model/user-view.entity';
import { AlbumLikeEntity } from '@/@model/album-like.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([UserLikeEntity, UserViewEntity, AlbumLikeEntity])
  ],
  controllers: [UserActionController],
  providers: [UserActionService],
})
export class UserActionModule {}
