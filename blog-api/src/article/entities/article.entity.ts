import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';
//Day3
@Entity('articles')
export class Article {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  title: string;

  @Column()
  body: string;
}