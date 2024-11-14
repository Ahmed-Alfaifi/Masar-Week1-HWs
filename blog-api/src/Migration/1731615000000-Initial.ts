import { MigrationInterface, QueryRunner } from "typeorm";

export class Initial1731615000000 implements MigrationInterface {
    name = 'Initial1731615000000'

    public async up(queryRunner: QueryRunner): Promise<void> {
        // Create users table first
        await queryRunner.query(`
            CREATE TABLE "users" (
                "id" SERIAL NOT NULL,
                "username" character varying NOT NULL,
                "password" character varying NOT NULL,
                CONSTRAINT "UQ_fe0bb3f6520ee0469504521e710" UNIQUE ("username"),
                CONSTRAINT "PK_users" PRIMARY KEY ("id")
            )
        `);

        // Create articles table with createdAt and authorId
        await queryRunner.query(`
            CREATE TABLE "articles" (
                "id" SERIAL NOT NULL,
                "title" character varying NOT NULL,
                "body" character varying NOT NULL,
                "authorId" integer NOT NULL,
                "createdAt" TIMESTAMP NOT NULL DEFAULT now(),
                CONSTRAINT "PK_articles" PRIMARY KEY ("id"),
                CONSTRAINT "FK_articles_author" FOREIGN KEY ("authorId") 
                    REFERENCES "users"("id") ON DELETE CASCADE
            )
        `);

        // Create comments table
        await queryRunner.query(`
            CREATE TABLE "comments" (
                "id" SERIAL NOT NULL,
                "content" character varying NOT NULL,
                "articleId" integer NOT NULL,
                "authorId" integer NOT NULL,
                "createdAt" TIMESTAMP NOT NULL DEFAULT now(),
                CONSTRAINT "PK_comments" PRIMARY KEY ("id"),
                CONSTRAINT "FK_comments_article" FOREIGN KEY ("articleId") 
                    REFERENCES "articles"("id") ON DELETE CASCADE,
                CONSTRAINT "FK_comments_author" FOREIGN KEY ("authorId") 
                    REFERENCES "users"("id") ON DELETE CASCADE
            )
        `);

        // Create articles_likes_users junction table
        await queryRunner.query(`
            CREATE TABLE "articles_likes_users" (
                "articlesId" integer NOT NULL,
                "usersId" integer NOT NULL,
                CONSTRAINT "PK_articles_likes" PRIMARY KEY ("articlesId", "usersId"),
                CONSTRAINT "FK_articles_likes_article" FOREIGN KEY ("articlesId") 
                    REFERENCES "articles"("id") ON DELETE CASCADE,
                CONSTRAINT "FK_articles_likes_user" FOREIGN KEY ("usersId") 
                    REFERENCES "users"("id") ON DELETE CASCADE
            )
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE "articles_likes_users"`);
        await queryRunner.query(`DROP TABLE "comments"`);
        await queryRunner.query(`DROP TABLE "articles"`);
        await queryRunner.query(`DROP TABLE "users"`);
    }
}