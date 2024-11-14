import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ArticleService } from './article.service';
import { ArticleController } from './article.controller';
import { Article } from './entities/article.entity';
import { CommentModule } from '../comment/comment.module';
import { UserModule } from '../user/user.module';
import { User } from '../user/entities/user.entity';
import { Comment } from '../comment/entities/comment.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Article, Comment, User]),
    CommentModule,
    UserModule
  ],
  controllers: [ArticleController],
  providers: [ArticleService],
})
export class ArticleModule {}