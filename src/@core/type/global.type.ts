import { ApiProperty } from '@nestjs/swagger';

import type { MEMBERSHIP } from '@/@model/user.entity';

export class Meta {
  @ApiProperty({ example: 10 })
  pageSize: number;

  @ApiProperty({ example: 1 })
  currentPage: number;

  @ApiProperty({ example: 1000 })
  total: number;

  @ApiProperty({ example: 100 })
  totalPage: number;
}

export class SwaggerMetaResponse {
  status_code: number;

  @ApiProperty({ example: 'Inquiry berhasil' })
  status_description: string;
}

export interface DataOnlyRes<T> {
  data: T;
}

export interface DataWithStatusRes<T> extends DataOnlyRes<T> {
  status_description: string;
}

export interface DataWithMetaRes<T> extends DataOnlyRes<T> {
  meta: Meta;
}

export interface StatusDataMetaRes<T>
  extends DataWithMetaRes<T>,
    DataWithStatusRes<T> {}

export interface UserTokenRaw {
  id?: string;
  membership?: MEMBERSHIP;
  iat?: number;
  exp?: number;
}

export interface UserSession {
  id?: string;
  membership?: MEMBERSHIP;
  login_at?: Date;
  iat?: number;
}
