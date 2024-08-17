import { CACHE_MANAGER } from '@nestjs/cache-manager';
import type { ExecutionContext } from '@nestjs/common';
import {
  ForbiddenException,
  Inject,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import type { Cache } from 'cache-manager';
import { TokenExpiredError } from 'jsonwebtoken';
import * as jwt from 'jsonwebtoken';
import { ExtractJwt } from 'passport-jwt';

import { JWT_CACHE_TTL, USER_SESSION_PREFIX } from '@core/utils/const';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  constructor(@Inject(CACHE_MANAGER) private readonly cacheService: Cache) {
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

      const userSession = await this.cacheService.get(
        `${USER_SESSION_PREFIX}${decoded['id_user']}`
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

      request.user = decoded;

      // Update expiration iat on redis
      this.cacheService.set(
        `${USER_SESSION_PREFIX}${decoded['id_user']}`,
        userSession,
        JWT_CACHE_TTL
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
