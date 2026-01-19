import { DataSource } from 'typeorm';
import * as dotenv from 'dotenv';
import { Tenant } from './tenants/tenant.entity';
import { User } from './users/user.entity';

dotenv.config();

export const AppDataSource = new DataSource({
    type: 'postgres',
    host: process.env.DB_HOST,
    port: parseInt(process.env.DB_PORT || '5432'),
    username: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE,
    entities: ['src/**/*.entity.ts'],
    migrations: ['src/migrations/*.ts'],
    synchronize: false,
    logging: true,
});
