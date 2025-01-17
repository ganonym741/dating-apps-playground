import { NestFactory } from '@nestjs/core';

import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { urlencoded } from 'express';
import helmet from 'helmet';
import * as setTZ from 'set-tz';
import { ValidationPipe } from '@nestjs/common';

import { AppModule } from '@/app.module';
import { ExceptionMiddleware } from '@core/middleware';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    cors: {
      origin: process.env.CLIENT_HOST,
      methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
    },
  });

  app.use(urlencoded({ limit: '100mb', extended: true }));
  app.setGlobalPrefix('api/v1');
  app.useGlobalFilters(new ExceptionMiddleware());

  // Configure security header
  app.use(
    helmet({
      contentSecurityPolicy: true,
      noSniff: true,
      xssFilter: true,
    })
  );

  // set default local timezone
  setTZ(process.env.TZ);

  if (process.env.NODE_ENV !== 'production') {
    const config = new DocumentBuilder()
      .setTitle('Dating App - Api')
      .setDescription('Endpoint for dating app dealls')
      .setVersion('1.0')
      .addTag('Dating App')
      .addBearerAuth()
      .build();
    const document = SwaggerModule.createDocument(app, config);

    SwaggerModule.setup('/docs', app, document);
  }

  app.useGlobalPipes(new ValidationPipe({transform: true}));
  await app.listen(parseInt(process.env.PORT, 10) || 3000);
}

bootstrap();
