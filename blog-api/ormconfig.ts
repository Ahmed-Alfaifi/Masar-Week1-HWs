import { DataSource } from 'typeorm';

export default new DataSource({
  type: 'postgres',
  host: 'localhost',
  port: 5433,
  username: 'postgres',
  password: '',
  database: 'blog_db',
  entities: ['src/**/*.entity{.ts,.js}'],
  migrations: ['src/migration/*.ts'],
  synchronize: false
});