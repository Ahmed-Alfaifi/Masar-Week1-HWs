import { MigrationInterface, QueryRunner } from "typeorm";

export class AddSearchIndexes1711147300000 implements MigrationInterface {
    public async up(queryRunner: QueryRunner): Promise<void> {
        // Add EXTENSION if not exists for full text search
        await queryRunner.query(`
            CREATE EXTENSION IF NOT EXISTS pg_trgm;
        `);

        // Add index for username search with trigram support
        await queryRunner.query(`
            CREATE INDEX idx_users_username_trigram ON users 
            USING gin (username gin_trgm_ops);
        `);

        // Add B-tree index for exact username matches
        await queryRunner.query(`
            CREATE INDEX idx_users_username_btree ON users 
            USING btree (username);
        `);

        // Add index for article title with trigram support
        await queryRunner.query(`
            CREATE INDEX idx_articles_title_trigram ON articles 
            USING gin (title gin_trgm_ops);
        `);

        // Add B-tree index for authorId in articles
        await queryRunner.query(`
            CREATE INDEX idx_articles_author_id ON articles 
            USING btree ("authorId");
        `);

        // Add full text search index for article body
        await queryRunner.query(`
            CREATE INDEX idx_articles_body_fts ON articles 
            USING gin (to_tsvector('english', body));
        `);

        // Add timestamp index for sorting
        await queryRunner.query(`
            CREATE INDEX idx_articles_created_at ON articles 
            USING btree (created_at DESC);
        `);

        // Add indexes for the followers/following relationship
        await queryRunner.query(`
            CREATE INDEX idx_users_follows_follower ON users_follows_users 
            USING btree ("userId_1");
        `);

        await queryRunner.query(`
            CREATE INDEX idx_users_follows_following ON users_follows_users 
            USING btree ("userId_2");
        `);

        // Add indexes for article likes
        await queryRunner.query(`
            CREATE INDEX idx_articles_likes_user ON users_likes_articles 
            USING btree ("userId");
        `);

        await queryRunner.query(`
            CREATE INDEX idx_articles_likes_article ON users_likes_articles 
            USING btree ("articleId");
        `);

        // Add composite indexes for better query performance
        await queryRunner.query(`
            CREATE INDEX idx_users_follows_composite ON users_follows_users 
            USING btree ("userId_1", "userId_2");
        `);

        await queryRunner.query(`
            CREATE INDEX idx_articles_likes_composite ON users_likes_articles 
            USING btree ("userId", "articleId");
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        // Drop all created indexes
        await queryRunner.query(`DROP INDEX IF EXISTS idx_users_username_trigram;`);
        await queryRunner.query(`DROP INDEX IF EXISTS idx_users_username_btree;`);
        await queryRunner.query(`DROP INDEX IF EXISTS idx_articles_title_trigram;`);
        await queryRunner.query(`DROP INDEX IF EXISTS idx_articles_author_id;`);
        await queryRunner.query(`DROP INDEX IF EXISTS idx_articles_body_fts;`);
        await queryRunner.query(`DROP INDEX IF EXISTS idx_articles_created_at;`);
        await queryRunner.query(`DROP INDEX IF EXISTS idx_users_follows_follower;`);
        await queryRunner.query(`DROP INDEX IF EXISTS idx_users_follows_following;`);
        await queryRunner.query(`DROP INDEX IF EXISTS idx_articles_likes_user;`);
        await queryRunner.query(`DROP INDEX IF EXISTS idx_articles_likes_article;`);
        await queryRunner.query(`DROP INDEX IF EXISTS idx_users_follows_composite;`);
        await queryRunner.query(`DROP INDEX IF EXISTS idx_articles_likes_composite;`);

        // Drop the extension if you want to completely clean up
        await queryRunner.query(`DROP EXTENSION IF EXISTS pg_trgm;`);
    }
}