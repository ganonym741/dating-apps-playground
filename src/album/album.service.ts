import { Injectable, NotFoundException } from '@nestjs/common';

import { InjectRepository } from '@nestjs/typeorm';

import type { Repository } from 'typeorm';

import type { CreateAlbumDto } from './dto/create-album.dto';
import type { UpdateAlbumDto } from './dto/update-album.dto';
import { AlbumEntity } from '@model/album.entity';

@Injectable()
export class AlbumService {
  constructor(@InjectRepository(AlbumEntity) private albumRepo: Repository<AlbumEntity>) {}
  
  async create(createAlbumDto: CreateAlbumDto) {
    const result = await this.albumRepo.save(createAlbumDto)
    
    if (result.id) return 'Album berhasil ditambahkan!';
  }

  async findByUserId(userId: string) {
    const result = await this.albumRepo.find({
      where: {
        id: userId,
      }
    });

    return result;
  }

  async update(id: string, updateAlbumDto: UpdateAlbumDto) {
    const result = (await this.albumRepo.update({ id: id }, updateAlbumDto))
      .affected;

    if (result === 0) {
      throw new NotFoundException('Album tidak ditemukan');
    } else {
      return 'Data user berhasil di update';
    }
  }

  async remove(id: string) {
    const result = (await this.albumRepo.delete({ id: id })).affected;

    if (result === 0) {
      throw new NotFoundException('Album tidak ditemukan');
    } else {
      return 'Album berhasil di hapus';
    }
  }
}
