import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserModule } from './user/user.module';

const entitiesPath = 'dist/**/*.entity{.ts,.js}';

@Module({
  imports: [TypeOrmModule.forRoot({
    type: 'postgres',
    host: 'localhost',
    port: 5433,
    username: 'postgres',
    password: '',
    database: 'masar-db',
    autoLoadEntities: true,
    entities: [entitiesPath],
    synchronize: false,
    logging: false,
  }), UserModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
