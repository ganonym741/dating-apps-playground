import type { TypeOrmModuleOptions } from '@nestjs/typeorm';

// eslint-disable-next-line @typescript-eslint/no-require-imports
require('dotenv').config();

class ConfigService {
  constructor(private env: { [k: string]: string | undefined }) {}

  public getValue(key: string, throwOnMissing = true) {
    const value = this.env[key];

    if (!value && throwOnMissing) {
      throw new Error(`config error - missing env.${key}`);
    }

    return value;
  }

  public ensureValues(keys: string[]) {
    keys.forEach((k) => this.getValue(k, true));

    return this;
  }

  public getPort() {
    return this.getValue('PORT', true);
  }

  public isProduction() {
    const mode = this.getValue('NODE_ENV', false);

    return mode != 'development';
  }

  public getTypeOrmConfig(): TypeOrmModuleOptions {
    return {
      type: 'postgres',
      name: 'default',
      host: this.getValue('POSTGRES_HOST'),
      port: parseInt(this.getValue('POSTGRES_PORT', false) ?? '5432'),
      username: this.getValue('POSTGRES_USER'),
      password: this.getValue('POSTGRES_PASSWORD'),
      database: this.getValue('POSTGRES_DATABASE'),

      entities: ['dist/**/*.entity.{js,ts}'],
      migrationsTableName: 'migrations',
      migrations: ['dist/migrations/*.{ts,js}'],
      synchronize: true,
      logging: !this.isProduction(),
      ssl: this.isProduction(),
    };
  }

  public getRedisConfig(): any {
    return {
      host: this.getValue('REDIS_HOST'),
      port: this.getValue('REDIS_PORT'),
    };
  }
}

export const configService = new ConfigService(process.env).ensureValues([
  'POSTGRES_HOST',
  'POSTGRES_PORT',
  'POSTGRES_USER',
  'POSTGRES_PASSWORD',
  'POSTGRES_DATABASE',
  'REDIS_HOST',
  'REDIS_PORT',
  'JWT_SECRET_SALT',
  'JWT_MAX_AGE',
  'JWTR_SECRET',
  'DECRYPT_SECRET_KEY',
  'DECRYPT_IV',
  'NODE_ENV',
]);
