import {
  Injectable,
  CallHandler,
  NestInterceptor,
  ExecutionContext,
} from '@nestjs/common';
import { Response } from 'express';
import { Observable, map } from 'rxjs';
import { IBaseResponse } from '../base/base-response.model';

@Injectable()
export class BaseResponseInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    return next.handle().pipe(
      map((data) => {
        const ctx = context.switchToHttp();
        const { statusCode, statusMessage } = ctx.getResponse() as Response;

        return <IBaseResponse<any>>{
          data,
          statusCode,
          message: statusCode >= 300 ? statusMessage : undefined,
        };
      }),
    );
  }
}
