import { DataSource } from 'typeorm';
import { faker } from '@faker-js/faker';
import { Article } from '../article/entities/article.entity';
import dataSource from '../../ormconfig';

async function populateArticles() {
    try {
        await dataSource.initialize();
        console.log('Database connection initialized');

        // First, get all user IDs from the database
        const userIds = await dataSource.query('SELECT id FROM users');
        console.log(`Found ${userIds.length} users to create articles for`);

        if (userIds.length === 0) {
            console.log('No users found. Please populate users first.');
            return;
        }

        const articleRepository = dataSource.getRepository(Article);
        const batchSize = 100;
        const articlesPerUser = 5; // Each user will have 5 articles
        let totalArticles = 0;

        console.log('Starting article population...');
        console.time('Population Time');

        for (let i = 0; i < userIds.length; i++) {
            const userId = userIds[i].id;
            const articles = [];

            // Create 5 articles for this user
            for (let j = 0; j < articlesPerUser; j++) {
                articles.push({
                    title: faker.lorem.sentence(4),
                    body: faker.lorem.paragraphs(3),
                    authorId: userId,
                });
            }

            try {
                await articleRepository.save(articles);
                totalArticles += articles.length;

                // Log progress every 100 users
                if ((i + 1) % 100 === 0) {
                    console.log(`Progress: ${i + 1}/${userIds.length} users processed (${totalArticles} articles created)`);
                }
            } catch (error) {
                console.error(`Error creating articles for user ${userId}:`, error);
                continue; // Continue with next user if there's an error
            }
        }

        console.timeEnd('Population Time');
        console.log(`Article population completed. Total articles created: ${totalArticles}`);

        // Print some statistics
        const stats = await dataSource.query(`
            SELECT COUNT(*) as total,
                   COUNT(DISTINCT "authorId") as authors,
                   MIN(LENGTH(body)) as min_body_length,
                   MAX(LENGTH(body)) as max_body_length,
                   AVG(LENGTH(body))::integer as avg_body_length
            FROM articles;
        `);
        console.log('\nArticle Statistics:', stats[0]);

    } catch (error) {
        console.error('Error during article population:', error);
    } finally {
        await dataSource.destroy();
    }
}

populateArticles();