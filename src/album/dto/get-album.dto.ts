import { ApiProperty } from '@nestjs/swagger';

export class GetManyAlbumDto {
  @ApiProperty({ example: 'uuid' })
  id?: string;

  @ApiProperty({ example: 'uuid' })
  user_id?: string;
}
