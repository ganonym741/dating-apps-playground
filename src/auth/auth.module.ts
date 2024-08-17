import { Module } from '@nestjs/common';
import { JwtModule, JwtService } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';

import { TypeOrmModule } from '@nestjs/typeorm';

import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { JwtStrategy } from './jwt.strategy';
import { LocalStrategy } from './local.strategy';
import { UserEntity } from '@/@model/user.entity';
import { USER_SESSION_TTL } from '@/@core/utils/const';

@Module({
  imports: [
    PassportModule,
    TypeOrmModule.forFeature([UserEntity]),
    JwtModule.register({
      secret: process.env.JWT_KEY,
      signOptions: { expiresIn: USER_SESSION_TTL },
    }),
  ],
  providers: [AuthService, JwtService, LocalStrategy, JwtStrategy],
  controllers: [AuthController],
})
export class AuthModule {}
