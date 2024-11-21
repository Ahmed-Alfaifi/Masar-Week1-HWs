import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany, ManyToMany, JoinColumn, CreateDateColumn } from 'typeorm';
import { User } from '../../user/entities/user.entity';
import { Comment } from '../../comment/entities/comment.entity';

@Entity('articles')
export class Article {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    title: string;

    @Column('text')
    body: string;

    @Column({ name: 'authorId' })
    authorId: number;

    @CreateDateColumn({ name: 'created_at' })
    createdAt: Date;

    @ManyToOne(() => User, user => user.articles)
    @JoinColumn({ name: 'authorId' })
    author: User;

    @OneToMany(() => Comment, comment => comment.article)
    comments: Comment[];

    @ManyToMany(() => User, user => user.likedArticles)
    likes: User[];
}