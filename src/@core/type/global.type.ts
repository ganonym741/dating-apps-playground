import { ApiProperty } from '@nestjs/swagger';

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
  id_user?: number;
  username?: string;
  iat?: number;
  exp?: number;
}
