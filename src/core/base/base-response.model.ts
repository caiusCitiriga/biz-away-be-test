import {
  getSchemaPath,
  ApiOkResponse,
  ApiExtraModels,
  ApiPropertyOptional,
} from '@nestjs/swagger';
import { HttpStatus, Type, applyDecorators } from '@nestjs/common';

export interface IBaseResponse<T> {
  data?: T;
  statusCode: number;
  message?: string | string[];
}

export class BaseResponseDto<T> implements IBaseResponse<T> {
  @ApiPropertyOptional({
    type: String,
    description: 'Optional, may not always be present',
  })
  message?: string;

  @ApiPropertyOptional({
    enum: HttpStatus,
    default: HttpStatus.OK,
    description:
      'The returned HTTP status code. Any of the listed codes could be returned. If code is different than 200, the "message" property might also be valorized',
  })
  statusCode: number;

  data?: T;
}

export const ApiBaseResponseDto = <T extends Type<any>>(model: T) => {
  return applyDecorators(
    ApiExtraModels(BaseResponseDto, model),
    ApiOkResponse({
      schema: {
        allOf: [
          { $ref: getSchemaPath(BaseResponseDto) },
          {
            properties: {
              data: {
                type: 'object',
                $ref: getSchemaPath(model),
              },
            },
          },
        ],
      },
    }),
  );
};

export const ApiListBaseResponseDto = <T extends Type<any>>(model: T) => {
  return applyDecorators(
    ApiExtraModels(BaseResponseDto, model),
    ApiOkResponse({
      schema: {
        allOf: [
          { $ref: getSchemaPath(BaseResponseDto) },
          {
            properties: {
              data: {
                type: 'array',
                items: { $ref: getSchemaPath(model) },
              },
            },
          },
        ],
      },
    }),
  );
};

export const ApiPrimitiveListBaseResponseDto = (
  type: 'string' | 'number' | 'boolean',
) => {
  return applyDecorators(
    ApiExtraModels(BaseResponseDto),
    ApiOkResponse({
      schema: {
        allOf: [
          { $ref: getSchemaPath(BaseResponseDto) },
          {
            properties: {
              data: {
                type: 'array',
                items: { type },
              },
            },
          },
        ],
      },
    }),
  );
};

export const ApiBooleanBaseResponseDto = () => {
  return applyDecorators(
    ApiExtraModels(BaseResponseDto),
    ApiOkResponse({
      schema: {
        allOf: [
          { $ref: getSchemaPath(BaseResponseDto) },
          {
            properties: {
              data: {
                type: 'boolean',
              },
            },
          },
        ],
      },
    }),
  );
};

export const ApiStringBaseResponseDto = () => {
  return applyDecorators(
    ApiExtraModels(BaseResponseDto),
    ApiOkResponse({
      schema: {
        allOf: [
          { $ref: getSchemaPath(BaseResponseDto) },
          {
            properties: {
              data: {
                type: 'string',
              },
            },
          },
        ],
      },
    }),
  );
};
