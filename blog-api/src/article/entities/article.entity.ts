import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany, ManyToMany, JoinTable, CreateDateColumn } from 'typeorm';
import { User } from '../../user/entities/user.entity';
import { Comment } from '../../comment/entities/comment.entity';

@Entity('articles')
export class Article {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  title: string;

  @Column()
  body: string;

  @ManyToOne(() => User, user => user.articles)
  author: User;

  @Column()
  authorId: number;

  @OneToMany(() => Comment, comment => comment.article)
  comments: Comment[];

  @ManyToMany(() => User, user => user.likedArticles)
  @JoinTable()
  likes: User[];

  @CreateDateColumn()
  createdAt: Date;
}