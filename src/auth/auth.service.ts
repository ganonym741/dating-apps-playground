import type { CacheStore } from '@nestjs/cache-manager';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Inject, Injectable } from '@nestjs/common';
import type { JwtService } from '@nestjs/jwt';

import * as jwt from 'jsonwebtoken';

import { JWT_CACHE_TTL, USER_SESSION_PREFIX } from '@core/utils/const';
import type { DataWithStatusRes, UserTokenRaw } from '@core/type/global.type';

import type { LoginDto, LoginResponseDto, TokenDto } from './dto/auth.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    @Inject(CACHE_MANAGER) private cacheService: CacheStore
  ) {}

  async login(payload: LoginDto): Promise<LoginResponseDto> {
    return {} as unknown as LoginResponseDto;
  }

  async logout(user: UserTokenRaw): Promise<DataWithStatusRes<object>> {
    // Delete user session
    await this.cacheService.del(`${USER_SESSION_PREFIX}${user.id_user}`);

    return {
      status_description: 'Logout berhasil!',
      data: {},
    };
  }

  async refreshToken(user: UserTokenRaw): Promise<TokenDto> {
    // Generate new user token
    const token = await this.createToken({
      id_user: user.id_user,
      username: user.username,
    });

    // Save login session to redis
    const decoded = jwt.decode(token);

    this.cacheService.set(
      `${USER_SESSION_PREFIX}${user.id_user}`,
      { iat: decoded['iat'] },
      { ttl: JWT_CACHE_TTL }
    );

    return {
      token: token,
      token_expired: +process.env.TOKEN_EXPIRATION,
    };
  }

  async createToken(payload: any): Promise<string> {
    return await this.jwtService.signAsync(payload, {
      secret: process.env.JWT_KEY,
      expiresIn: +process.env.TOKEN_EXPIRATION,
    });
  }
}
