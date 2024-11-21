import { Entity, PrimaryGeneratedColumn, Column, OneToMany, ManyToMany, JoinTable, CreateDateColumn } from 'typeorm';
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

    @CreateDateColumn({ name: 'created_at' })
    createdAt: Date;

    @OneToMany(() => Article, article => article.author)
    articles: Article[];

    @OneToMany(() => Comment, comment => comment.author)
    comments: Comment[];

    @ManyToMany(() => Article)
    @JoinTable({
        name: 'users_likes_articles',
        joinColumn: {
            name: 'userId',
            referencedColumnName: 'id'
        },
        inverseJoinColumn: {
            name: 'articleId',
            referencedColumnName: 'id'
        }
    })
    likedArticles: Article[];

    @ManyToMany(() => User)
    @JoinTable({
        name: 'users_follows_users',
        joinColumn: {
            name: 'userId_1',
            referencedColumnName: 'id'
        },
        inverseJoinColumn: {
            name: 'userId_2',
            referencedColumnName: 'id'
        }
    })
    following: User[];

    @ManyToMany(() => User, user => user.following)
    followers: User[];
}