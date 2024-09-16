import { DataSource } from 'typeorm';
import { Url } from '@/app/entities/Url'

export const AppDataSource = new DataSource({
  
  type: 'postgres',
  host: process.env.DB_HOST,
  port: process.env.DB_PORT ? parseInt(process.env.DB_PORT, 10) : undefined,
  username: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  entities: [Url],
  synchronize: true,
});
