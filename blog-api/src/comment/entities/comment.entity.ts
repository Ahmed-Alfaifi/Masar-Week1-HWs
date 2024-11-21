import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, CreateDateColumn } from 'typeorm';
import { Article } from '../../article/entities/article.entity';
import { User } from '../../user/entities/user.entity';

@Entity('comments')
export class Comment {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    content: string;

    @Column({ name: 'authorId' })
    authorId: number;

    @Column({ name: 'articleId' })
    articleId: number;

    @CreateDateColumn({ name: 'created_at' })
    createdAt: Date;

    @ManyToOne(() => User, user => user.comments)
    @JoinColumn({ name: 'authorId' })
    author: User;

    @ManyToOne(() => Article, article => article.comments)
    @JoinColumn({ name: 'articleId' })
    article: Article;
}