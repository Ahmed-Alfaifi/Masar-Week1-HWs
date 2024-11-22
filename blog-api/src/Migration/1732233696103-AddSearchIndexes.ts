import { MigrationInterface, QueryRunner } from "typeorm";

export class AddSearchIndexes1732233696103 implements MigrationInterface {
    name = 'AddSearchIndexes1732233696103'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "comments" DROP CONSTRAINT "comments_authorId_fkey"`);
        await queryRunner.query(`ALTER TABLE "comments" DROP CONSTRAINT "comments_articleId_fkey"`);
        await queryRunner.query(`ALTER TABLE "articles" DROP CONSTRAINT "articles_authorId_fkey"`);
        await queryRunner.query(`ALTER TABLE "users_likes_articles" DROP CONSTRAINT "users_likes_articles_userId_fkey"`);
        await queryRunner.query(`ALTER TABLE "users_likes_articles" DROP CONSTRAINT "users_likes_articles_articleId_fkey"`);
        await queryRunner.query(`ALTER TABLE "users_follows_users" DROP CONSTRAINT "users_follows_users_userId_1_fkey"`);
        await queryRunner.query(`ALTER TABLE "users_follows_users" DROP CONSTRAINT "users_follows_users_userId_2_fkey"`);
        await queryRunner.query(`ALTER TABLE "comments" ALTER COLUMN "created_at" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "comments" ALTER COLUMN "created_at" SET DEFAULT now()`);
        await queryRunner.query(`ALTER TABLE "articles" ALTER COLUMN "created_at" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "articles" ALTER COLUMN "created_at" SET DEFAULT now()`);
        await queryRunner.query(`ALTER TABLE "users" ALTER COLUMN "created_at" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "users" ALTER COLUMN "created_at" SET DEFAULT now()`);
        await queryRunner.query(`CREATE INDEX "IDX_9bde167050c22bd184c5680867" ON "users_likes_articles" ("userId") `);
        await queryRunner.query(`CREATE INDEX "IDX_5f265313fca961fccf61a73afb" ON "users_likes_articles" ("articleId") `);
        await queryRunner.query(`CREATE INDEX "IDX_2a493614b464d995c360e066f8" ON "users_follows_users" ("userId_1") `);
        await queryRunner.query(`CREATE INDEX "IDX_19f0a50bcbae9498881de80c39" ON "users_follows_users" ("userId_2") `);
        await queryRunner.query(`ALTER TABLE "comments" ADD CONSTRAINT "FK_4548cc4a409b8651ec75f70e280" FOREIGN KEY ("authorId") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "comments" ADD CONSTRAINT "FK_b0011304ebfcb97f597eae6c31f" FOREIGN KEY ("articleId") REFERENCES "articles"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "articles" ADD CONSTRAINT "FK_65d9ccc1b02f4d904e90bd76a34" FOREIGN KEY ("authorId") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "users_likes_articles" ADD CONSTRAINT "FK_9bde167050c22bd184c56808672" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE "users_likes_articles" ADD CONSTRAINT "FK_5f265313fca961fccf61a73afb9" FOREIGN KEY ("articleId") REFERENCES "articles"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE "users_follows_users" ADD CONSTRAINT "FK_2a493614b464d995c360e066f89" FOREIGN KEY ("userId_1") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE "users_follows_users" ADD CONSTRAINT "FK_19f0a50bcbae9498881de80c393" FOREIGN KEY ("userId_2") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "users_follows_users" DROP CONSTRAINT "FK_19f0a50bcbae9498881de80c393"`);
        await queryRunner.query(`ALTER TABLE "users_follows_users" DROP CONSTRAINT "FK_2a493614b464d995c360e066f89"`);
        await queryRunner.query(`ALTER TABLE "users_likes_articles" DROP CONSTRAINT "FK_5f265313fca961fccf61a73afb9"`);
        await queryRunner.query(`ALTER TABLE "users_likes_articles" DROP CONSTRAINT "FK_9bde167050c22bd184c56808672"`);
        await queryRunner.query(`ALTER TABLE "articles" DROP CONSTRAINT "FK_65d9ccc1b02f4d904e90bd76a34"`);
        await queryRunner.query(`ALTER TABLE "comments" DROP CONSTRAINT "FK_b0011304ebfcb97f597eae6c31f"`);
        await queryRunner.query(`ALTER TABLE "comments" DROP CONSTRAINT "FK_4548cc4a409b8651ec75f70e280"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_19f0a50bcbae9498881de80c39"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_2a493614b464d995c360e066f8"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_5f265313fca961fccf61a73afb"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_9bde167050c22bd184c5680867"`);
        await queryRunner.query(`ALTER TABLE "users" ALTER COLUMN "created_at" SET DEFAULT CURRENT_TIMESTAMP`);
        await queryRunner.query(`ALTER TABLE "users" ALTER COLUMN "created_at" DROP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "articles" ALTER COLUMN "created_at" SET DEFAULT CURRENT_TIMESTAMP`);
        await queryRunner.query(`ALTER TABLE "articles" ALTER COLUMN "created_at" DROP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "comments" ALTER COLUMN "created_at" SET DEFAULT CURRENT_TIMESTAMP`);
        await queryRunner.query(`ALTER TABLE "comments" ALTER COLUMN "created_at" DROP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "users_follows_users" ADD CONSTRAINT "users_follows_users_userId_2_fkey" FOREIGN KEY ("userId_2") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "users_follows_users" ADD CONSTRAINT "users_follows_users_userId_1_fkey" FOREIGN KEY ("userId_1") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "users_likes_articles" ADD CONSTRAINT "users_likes_articles_articleId_fkey" FOREIGN KEY ("articleId") REFERENCES "articles"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "users_likes_articles" ADD CONSTRAINT "users_likes_articles_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "articles" ADD CONSTRAINT "articles_authorId_fkey" FOREIGN KEY ("authorId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "comments" ADD CONSTRAINT "comments_articleId_fkey" FOREIGN KEY ("articleId") REFERENCES "articles"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "comments" ADD CONSTRAINT "comments_authorId_fkey" FOREIGN KEY ("authorId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

}
