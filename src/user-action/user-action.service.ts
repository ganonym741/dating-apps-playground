/* eslint-disable @typescript-eslint/consistent-type-imports */
import {
  BadRequestException,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import type { Repository } from 'typeorm';

import type { UserSession } from '@core/type/global.type';
import { UserLikeEntity } from '@/@model/user-like.entity';
import { UserViewEntity } from '@/@model/user-view.entity';
import { AlbumLikeEntity } from '@/@model/album-like.entity';
import { AlbumEntity } from '@model/album.entity';
import { MEMBERSHIP } from '@/@model/user.entity';
import { RedisCacheService } from '@core/service/cache.service';
import { VIEW_SESSION_PREFIX, VIEW_SESSION_TTL } from '@core/utils/const';

@Injectable()
export class UserActionService {
  constructor(
    @InjectRepository(UserLikeEntity)
    private userLikeRepo: Repository<UserLikeEntity>,
    @InjectRepository(UserViewEntity)
    private userViewRepo: Repository<UserViewEntity>,
    @InjectRepository(AlbumLikeEntity)
    private albumLikeRepo: Repository<AlbumLikeEntity>,
    @InjectRepository(AlbumEntity)
    private albumRepo: Repository<AlbumEntity>,
    private readonly cacheService: RedisCacheService
  ) {}

  async likeUser(req: UserSession, userId: string) {
    let response = 'Sukses membatalkan menyukai user';

    const existingUser = await this.userLikeRepo.findOne({
      where: {
        user_id: userId,
        liked_by_id: req.id,
      },
      withDeleted: true,
    });

    if (existingUser.deleted_at) {
      response = 'Sukses menyukai user';
    }

    if (existingUser) {
      // If found, update the existing user
      await this.userLikeRepo.update(existingUser.id, {
        ...(existingUser.deleted_at
          ? { created_at: new Date(), deleted_at: null }
          : { deleted_at: new Date() }),
      });
    } else {
      // If not found, insert a new user
      await this.userLikeRepo.save({
        user_id: userId,
        liked_by_id: req.id,
      });
    }

    return response;
  }

  async viewUser(req: UserSession, userId: string) {
    const except = (
      await this.cacheService.getKeys(VIEW_SESSION_PREFIX + '*:' + req.id)
    ).map((item) => item.split(':').at(1));

    console.log(except);
    if (except.includes(userId))
      throw new BadRequestException('User ini sudah anda lihat sebelumnya');
    if (req.id === userId)
      throw new BadRequestException('User ini tidak valid');

    await this.userViewRepo.save({
      user_id: userId,
      viewed_by_id: req.id,
      created_at: new Date(),
    });

    await this.cacheService.save(
      `${VIEW_SESSION_PREFIX}${userId}:${req.id}`,
      '-',
      VIEW_SESSION_TTL
    );

    return 'User viewed';
  }

  async likeAlbum(req: UserSession, albumId: string) {
    let response = 'Sukses membatalkan menyukai album';

    const existingAlbum = await this.albumLikeRepo.findOne({
      where: {
        album_id: albumId,
        liked_by_id: req.id,
      },
      withDeleted: true,
    });

    if (existingAlbum.deleted_at) {
      response = 'Sukses menyukai album';
    }

    if (existingAlbum) {
      await this.albumRepo.update(albumId, {
        like: () => `like ${existingAlbum.deleted_at ? '+ 1' : '- 1'}`,
      });
      await this.albumLikeRepo.update(existingAlbum.id, {
        ...(existingAlbum.deleted_at
          ? { created_at: new Date(), deleted_at: null }
          : { deleted_at: new Date() }),
      });
    } else {
      // If not found, insert a new album-like
      await this.albumLikeRepo.save({
        album_id: albumId,
        liked_by_id: req.id,
      });
    }

    return response;
  }

  async viewUserLike(req: UserSession) {
    if (req.membership === MEMBERSHIP.Basic)
      throw new ForbiddenException(
        'Upgrade user anda untuk bisa melihat fans anda.'
      );

    const result = await this.userLikeRepo.find({
      where: {
        user_id: req.id,
      },
      relations: { liked_by: true, user: false },
    });

    return result;
  }

  async viewUserView(req: UserSession) {
    if (req.membership === MEMBERSHIP.Basic)
      throw new ForbiddenException(
        'Upgrade user anda untuk bisa melihat pengagum anda.'
      );

    const result = await this.userViewRepo.find({
      where: {
        user_id: req.id,
      },
      relations: { viewed_by: true, user: false },
    });

    return result;
  }

  async viewAlbumLike(req: UserSession, albumId: string) {
    const album = await this.albumRepo.findOne({ where: { id: albumId } });

    if (album.user_id === req.id)
      throw new ForbiddenException(
        'Anda tidak di izinkan melihat detail like album'
      );

    if (req.membership === MEMBERSHIP.Basic)
      throw new ForbiddenException(
        'Upgrade user anda untuk bisa melihat penyuka album anda.'
      );

    const result = await this.albumLikeRepo.find({
      where: {
        album_id: albumId,
      },
      relations: { liked_by: true, album: false },
    });

    return result;
  }
}
