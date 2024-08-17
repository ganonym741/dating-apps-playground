import { registerAs } from '@nestjs/config';
import type { DataSourceOptions } from 'typeorm';
import { DataSource } from 'typeorm';

import { configService } from '../config/config.service';

const config = configService.getTypeOrmConfig();

export default registerAs('typeorm', () => config);
export const connectionSource = new DataSource(config as DataSourceOptions);
