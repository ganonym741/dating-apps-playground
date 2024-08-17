/* eslint-disable @typescript-eslint/consistent-type-imports */
import type { ExecutionContext } from '@nestjs/common';
import {
  ForbiddenException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { TokenExpiredError } from 'jsonwebtoken';
import * as jwt from 'jsonwebtoken';
import { ExtractJwt } from 'passport-jwt';

import { USER_SESSION_TTL, USER_SESSION_PREFIX } from '@core/utils/const';
import type { UserSession } from '@core/type/global.type';
import { RedisCacheService } from '../service/cache.service';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  constructor(private readonly cacheService: RedisCacheService) {
    super();
  }

  handleRequest(err, user, info: Error) {
    if (info instanceof TokenExpiredError) {
      return true;
    }

    return user;
  }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    try {
      const request = context.switchToHttp().getRequest();

      const accessToken = ExtractJwt.fromAuthHeaderAsBearerToken()(request);

      if (!accessToken) {
        throw new UnauthorizedException('Request Unauthorized!');
      }

      const decoded = jwt.decode(accessToken);
      const userSession: UserSession = JSON.parse(
        await this.cacheService.getValue(
          `${USER_SESSION_PREFIX}${decoded['id']}`
        )
      );

      if (!userSession || decoded['iat'] != userSession['iat']) {
        throw new UnauthorizedException('Token invalid, please relogin.');
      }

      if (
        !/token\/refresh$/.test(request.route.path) &&
        Date.now() >= decoded['exp'] * 1000 &&
        process.env.NODE_ENV !== 'development'
      ) {
        throw new ForbiddenException('Session expired!');
      }

      request.user = userSession;

      // Update expiration on redis
      await this.cacheService.save(
        `${USER_SESSION_PREFIX}${decoded['id']}`,
        JSON.stringify(userSession),
        USER_SESSION_TTL
      );

      return true;
    } catch (e: any) {
      if (e instanceof ForbiddenException) {
        throw new ForbiddenException(e.message);
      }

      throw new UnauthorizedException(e.message);
    }
  }
}
