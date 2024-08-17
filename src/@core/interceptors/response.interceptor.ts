import type {
  CallHandler,
  ExecutionContext,
  NestInterceptor,
} from '@nestjs/common';
import { Injectable } from '@nestjs/common';
import type { Observable } from 'rxjs';
import { map } from 'rxjs';

import { CryptService } from '../utils/encryption';

@Injectable()
export class ResponseInterceptor implements NestInterceptor {
  constructor() {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    return next.handle().pipe(
      map((response) => {
        return {
          ...response,
          data: CryptService.encrypt(JSON.stringify(response.data ?? response)),
        };
      })
    );
  }
}
