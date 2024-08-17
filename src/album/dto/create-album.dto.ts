import { OmitType } from '@nestjs/swagger';

import { AlbumEntity } from '@model/album.entity';

export class CreateAlbumDto extends OmitType(AlbumEntity, [
  'id',
  'created_at',
  'deleted_at',
  'updated_at',
  'like'
]) {}
