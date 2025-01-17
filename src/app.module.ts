/* eslint-disable lines-around-comment */
import type { MiddlewareConsumer } from '@nestjs/common';
import { Global, Inject, Module, RequestMethod } from '@nestjs/common';
import { CACHE_MANAGER, CacheModule } from '@nestjs/cache-manager';
import * as redisStore from 'cache-manager-redis-store';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
// import { APP_INTERCEPTOR } from '@nestjs/core';

import { configService } from '@core/config';
// import { RequestInterceptor } from '@core/interceptors/request.interceptors';
// import { ResponseInterceptor } from '@core/interceptors/response.interceptor';
import { ResponseMiddleware } from '@core/middleware';
import { AuthModule } from './auth/auth.module';
import { LoggerService } from '@core/logger/logger.service';
import { UserModule } from './user/user.module';
import { AlbumModule } from './album/album.module';
import { UserActionModule } from './user-action/user-action.module';
import { AppController } from './app.controller';
import { UserEntity } from '@model/user.entity';
import { Seeder } from '@core/seeds/seeds.service';

@Global()
@Module({
  imports: [
    TypeOrmModule.forRoot(configService.getTypeOrmConfig()),
    TypeOrmModule.forFeature([UserEntity]),
    ConfigModule.forRoot({ isGlobal: true }),
    CacheModule.register({
      isGlobal: true,
      store: redisStore,
      ...configService.getRedisConfig(),
    }),
    AuthModule,
    UserModule,
    AlbumModule,
    UserActionModule,
  ],
  controllers: [AppController],
  providers: [
    Seeder,
    LoggerService,
    // {
    //   provide: APP_INTERCEPTOR,
    //   useClass: RequestInterceptor,
    // },
    // {
    //   provide: APP_INTERCEPTOR,
    //   useClass: ResponseInterceptor,
    // },
  ],
})
export class AppModule {
  constructor(@Inject(CACHE_MANAGER) cacheManager) {
    try {
      const client = cacheManager.store.getClient();

      client.on('error', (error) => {
        console.info(`Redis error: ${error}`);
      });

      client.on('end', () => {
        console.info('Redis connection ended');
      });

      client.on('reconnecting', () => {
        console.info('Redis is reconnecting');
      });
    } catch (error) {
      console.error(`Error while initializing Redis connection: ${error}`);
    }
  }

  public configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(ResponseMiddleware)
      .forRoutes({ path: '*', method: RequestMethod.ALL });
  }
}
