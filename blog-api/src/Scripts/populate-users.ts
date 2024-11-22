// src/scripts/populate-users.ts
import { DataSource } from 'typeorm';
import { faker } from '@faker-js/faker';
import { User } from '../user/entities/user.entity';
import * as bcrypt from 'bcrypt';
import dataSource from '../../ormconfig';

async function populateUsers(count: number) {
    try {
        await dataSource.initialize();
        console.log('Database connection initialized');

        const userRepository = dataSource.getRepository(User);
        const batchSize = 1000;
        const totalBatches = Math.ceil(count / batchSize);

        console.log(`Starting to populate ${count} users...`);
        console.time('Population Time');

        let totalUsersCreated = 0;

        for (let i = 0; i < totalBatches; i++) {
            const users = [];
            const currentBatchSize = Math.min(batchSize, count - i * batchSize);

            for (let j = 0; j < currentBatchSize; j++) {
                const timestamp = Date.now() + j; // Add j to make each timestamp unique within the batch
                const hashedPassword = await bcrypt.hash('password123', 10);
                const uniqueUsername = `${faker.internet.username()}_${timestamp}`;
                
                users.push({
                    username: uniqueUsername.substring(0, 50), // Ensure it doesn't exceed DB field length
                    password: hashedPassword,
                });
            }

            await userRepository.save(users);
            totalUsersCreated += users.length;
            console.log(`Batch ${i + 1}/${totalBatches} completed. Total users created: ${totalUsersCreated}`);
        }

        console.timeEnd('Population Time');
        console.log(`Population completed. Total users created: ${totalUsersCreated}`);
    } catch (error) {
        console.error('Error populating users:', error);
    } finally {
        await dataSource.destroy();
    }
}

// Default to 100,000 users if no argument provided
const userCount = process.argv[2] ? parseInt(process.argv[2]) : 100000;
populateUsers(userCount);