import { Module } from '@nestjs/common';
import { JwtModule, JwtService } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';

import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { JwtStrategy } from './jwt.strategy';
import { LocalStrategy } from './local.strategy';

@Module({
  imports: [
    PassportModule,
    JwtModule.register({
      secret: process.env.JWT_KEY,
      signOptions: { expiresIn: 60 * 60 * 3 }, // <--- expires in 3 hours
    }),
  ],
  providers: [AuthService, JwtService, LocalStrategy, JwtStrategy],
  controllers: [AuthController],
})
export class AuthModule {}
