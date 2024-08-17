import type { Type } from '@nestjs/common';
import { applyDecorators } from '@nestjs/common';
import { ApiExtraModels, ApiResponse, getSchemaPath } from '@nestjs/swagger';

import { SwaggerMetaResponse, Meta } from '@core/type/global.type';

export const MapResponseSwagger = <
  DataDto extends Type<unknown>,
  Options extends { status: number; isArray: boolean },
>(
  dataDto: DataDto,
  options: Options
) =>
  applyDecorators(
    ApiExtraModels(SwaggerMetaResponse, Meta, dataDto),
    ApiResponse({
      status: options.status,
      schema: {
        allOf: [
          { $ref: getSchemaPath(SwaggerMetaResponse) },
          {
            ...(options.isArray
              ? {
                  properties: {
                    status_code: {
                      example: options.status,
                    },
                    data: {
                      type: 'array',
                      items: { $ref: getSchemaPath(dataDto) },
                    },

                    // meta: {
                    //   $ref: getSchemaPath('Meta'),
                    // },
                  },
                }
              : {
                  properties: {
                    status_code: {
                      example: options.status,
                    },
                    data: {
                      $ref: getSchemaPath(dataDto),
                    },
                  },
                }),
          },
        ],
      },
    })
  );
