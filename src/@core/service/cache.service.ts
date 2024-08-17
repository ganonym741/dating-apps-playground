import { Injectable, Inject } from '@nestjs/common';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import type { Cache } from 'cache-manager';

@Injectable()
export class RedisCacheService {
  constructor(@Inject(CACHE_MANAGER) private readonly cache: Cache) {}

  async getKeys(key: string): Promise<string[]> {
    return await this.cache.store.keys(key);
  }

  async getValue(key: string): Promise<string> {
    return await this.cache.get(key);
  }

  async save(key: string, value: any, ttl: number): Promise<void> {
    return await this.cache.set(key, value, ttl);
  }

  async delete(key: string): Promise<void> {
    return await this.cache.del(key);
  }

  async getMultipleKeydata(key: string): Promise<{ [key: string]: any }> {
    const redisKeys = await this.getKeys(key);
    const data: { [key: string]: any } = {};

    for (const key of redisKeys) {
      data[key] = await this.getValue(key);
    }

    return data;
  }
}
