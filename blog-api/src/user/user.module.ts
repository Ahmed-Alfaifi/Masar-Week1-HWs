import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Article } from '../article/entities/article.entity';
import { UserService } from './user.service';
import { UserController } from './user.controller';

@Module({
    imports: [TypeOrmModule.forFeature([User, Article])],
    providers: [UserService],
    controllers: [UserController],
    exports: [UserService],
})
export class UserModule {}