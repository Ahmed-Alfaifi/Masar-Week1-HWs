import { MigrationInterface, QueryRunner } from "typeorm"

export class CreateTables1732227430477 implements MigrationInterface {
    public async up(queryRunner: QueryRunner): Promise<void> {
        // Create users table
        await queryRunner.query(`
            CREATE TABLE "users" (
                "id" SERIAL PRIMARY KEY,
                "username" varchar UNIQUE NOT NULL,
                "password" varchar NOT NULL,
                "created_at" timestamp DEFAULT CURRENT_TIMESTAMP
            )
        `);

        // Create articles table
        await queryRunner.query(`
            CREATE TABLE "articles" (
                "id" SERIAL PRIMARY KEY,
                "title" varchar NOT NULL,
                "body" text NOT NULL,
                "authorId" integer NOT NULL,
                "created_at" timestamp DEFAULT CURRENT_TIMESTAMP,
                FOREIGN KEY ("authorId") REFERENCES "users"("id") ON DELETE CASCADE
            )
        `);

        // Create comments table
        await queryRunner.query(`
            CREATE TABLE "comments" (
                "id" SERIAL PRIMARY KEY,
                "content" varchar NOT NULL,
                "authorId" integer NOT NULL,
                "articleId" integer NOT NULL,
                "created_at" timestamp DEFAULT CURRENT_TIMESTAMP,
                FOREIGN KEY ("authorId") REFERENCES "users"("id") ON DELETE CASCADE,
                FOREIGN KEY ("articleId") REFERENCES "articles"("id") ON DELETE CASCADE
            )
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE IF EXISTS "comments"`);
        await queryRunner.query(`DROP TABLE IF EXISTS "articles"`);
        await queryRunner.query(`DROP TABLE IF EXISTS "users"`);
    }
}