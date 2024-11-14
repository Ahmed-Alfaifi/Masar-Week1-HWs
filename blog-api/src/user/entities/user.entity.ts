import { Entity, PrimaryGeneratedColumn, Column, OneToMany, ManyToMany } from 'typeorm';
import { Article } from '../../article/entities/article.entity';
import { Comment } from '../../comment/entities/comment.entity';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  username: string;

  @Column()
  password: string;

  @OneToMany(() => Article, article => article.author)
  articles: Article[];

  @OneToMany(() => Comment, comment => comment.author)
  comments: Comment[];

  @ManyToMany(() => Article, article => article.likes)
  likedArticles: Article[];
}