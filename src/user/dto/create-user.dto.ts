import { OmitType } from '@nestjs/swagger';

import { UserEntity } from '@/@model/user.entity';

export class CreateUserDto extends OmitType(UserEntity, [
  'id',
  'created_at',
  'deleted_at',
  'updated_at',
]) {}
