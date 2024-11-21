import { MigrationInterface, QueryRunner } from "typeorm"

export class CreateRelationTables1732227430478 implements MigrationInterface {
    public async up(queryRunner: QueryRunner): Promise<void> {
        // Create users_follows_users table
        await queryRunner.query(`
            CREATE TABLE "users_follows_users" (
                "userId_1" integer NOT NULL,
                "userId_2" integer NOT NULL,
                FOREIGN KEY ("userId_1") REFERENCES "users"("id") ON DELETE CASCADE,
                FOREIGN KEY ("userId_2") REFERENCES "users"("id") ON DELETE CASCADE,
                PRIMARY KEY ("userId_1", "userId_2")
            )
        `);

        // Create users_likes_articles table
        await queryRunner.query(`
            CREATE TABLE "users_likes_articles" (
                "userId" integer NOT NULL,
                "articleId" integer NOT NULL,
                FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE,
                FOREIGN KEY ("articleId") REFERENCES "articles"("id") ON DELETE CASCADE,
                PRIMARY KEY ("userId", "articleId")
            )
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE IF EXISTS "users_likes_articles"`);
        await queryRunner.query(`DROP TABLE IF EXISTS "users_follows_users"`);
    }
}