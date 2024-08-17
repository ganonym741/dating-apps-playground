import type { CacheStore } from '@nestjs/cache-manager';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Inject, Injectable, UnauthorizedException } from '@nestjs/common';
// eslint-disable-next-line @typescript-eslint/consistent-type-imports
import { JwtService } from '@nestjs/jwt';
import * as jwt from 'jsonwebtoken';
import { InjectRepository } from '@nestjs/typeorm';
import type { Repository } from 'typeorm';

import { USER_SESSION_TTL, USER_SESSION_PREFIX } from '@core/utils/const';
import type {
  DataWithStatusRes,
  UserSession,
  UserTokenRaw,
} from '@core/type/global.type';

import type { LoginDto, TokenDto } from './dto/auth.dto';
import { LoginResponseDto } from './dto/auth.dto';
import { CryptService } from '@core/utils/encryption';
import { UserEntity } from '@model/user.entity';

@Injectable()
export class AuthService {
  constructor(
    @Inject(CACHE_MANAGER) private cacheService: CacheStore,
    @InjectRepository(UserEntity) private userRepo: Repository<UserEntity>,
    private readonly jwtService: JwtService,
  ) {}

  async login(payload: LoginDto): Promise<LoginResponseDto> {
    const { username, password } = payload;
    const passwordEncrypt = CryptService.encrypt(password);

    // Verify user credentials
    const userData = await this.userRepo.findOneBy({
      username: username,
      password: passwordEncrypt,
    });

    if (!userData) {
      throw new UnauthorizedException('Email atau password tidak valid');
    }

    // Generate user token
    const token = await this.createToken({
      id: userData.id,
      membership: userData.membership,
    });

    // Save login session to redis
    const decoded = jwt.decode(token);

    this.cacheService.set<UserSession>(
      `${USER_SESSION_PREFIX}${userData.id}`,
      {
        id: userData.id,
        membership: userData.membership,
        login_at: new Date(),
        iat: decoded['iat'],
      },
      {
        ttl: USER_SESSION_TTL,
      }
    );

    return {
      jwt: {
        token: token,
        token_expired: USER_SESSION_TTL,
      },
      ...Object.assign(LoginResponseDto, userData),
    };
  }

  async logout(user: UserSession): Promise<DataWithStatusRes<object>> {
    // Delete user session
    await this.cacheService.del(`${USER_SESSION_PREFIX}${user.id}`);

    return {
      status_description: 'Logout berhasil!',
      data: {},
    };
  }

  async refreshToken(user: UserSession): Promise<TokenDto> {
    // Generate new user token
    const token = await this.createToken({
      id: user.id,
      membership: user.membership,
    });

    // Save login session to redis
    const decoded = jwt.decode(token);

    this.cacheService.set<UserSession>(
      `${USER_SESSION_PREFIX}${user.id}`,
      { ...user, iat: decoded['iat'] },
      { ttl: USER_SESSION_TTL }
    );

    return {
      token: token,
      token_expired: +process.env.JWT_MAX_AGE,
    };
  }

  async createToken(payload: UserTokenRaw): Promise<string> {
    return await this.jwtService.signAsync(payload, {
      secret: process.env.JWT_SECRET_SALT,
      expiresIn: +process.env.JWT_MAX_AGE,
    });
  }
}
