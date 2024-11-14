import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, CreateDateColumn } from 'typeorm';
import { Article } from '../../article/entities/article.entity';
import { User } from '../../user/entities/user.entity';

@Entity('comments')
export class Comment {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  content: string;

  @ManyToOne(() => Article, article => article.comments)
  article: Article;

  @Column()
  articleId: number;

  @ManyToOne(() => User, user => user.comments)
  author: User;

  @Column()
  authorId: number;

  @CreateDateColumn()
  createdAt: Date;
}