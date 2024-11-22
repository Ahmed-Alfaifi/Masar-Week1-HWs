import { DataSource } from 'typeorm';
import dataSource from '../../ormconfig';

async function testSearchPerformance() {
    try {
        await dataSource.initialize();
        console.log('Database connection initialized');

        // Test without index
        console.log('\nTesting username search WITHOUT index...');
        await dataSource.query('DROP INDEX IF EXISTS idx_users_username_trigram;');
        await dataSource.query('DROP INDEX IF EXISTS idx_users_username_btree;');
        
        // Perform multiple searches and measure time
        for (let i = 0; i < 5; i++) {
            const searchTerm = 'user_1'; // This will match several usernames
            const start = process.hrtime();
            
            const result = await dataSource.query(`
                SELECT * FROM users 
                WHERE username LIKE $1 
                LIMIT 10
            `, [`%${searchTerm}%`]);

            const end = process.hrtime(start);
            const executionTime = (end[0] * 1000000000 + end[1]) / 1000000; // Convert to milliseconds
            console.log(`Search ${i + 1} took ${executionTime.toFixed(2)}ms (found ${result.length} results)`);
        }

        // Create indexes
        console.log('\nCreating indexes...');
        await dataSource.query('CREATE EXTENSION IF NOT EXISTS pg_trgm;');
        await dataSource.query('CREATE INDEX idx_users_username_trigram ON users USING gin (username gin_trgm_ops);');
        await dataSource.query('CREATE INDEX idx_users_username_btree ON users USING btree (username);');

        // Test with index
        console.log('\nTesting username search WITH index...');
        for (let i = 0; i < 5; i++) {
            const searchTerm = 'user_1';
            const start = process.hrtime();
            
            const result = await dataSource.query(`
                SELECT * FROM users 
                WHERE username LIKE $1 
                LIMIT 10
            `, [`%${searchTerm}%`]);

            const end = process.hrtime(start);
            const executionTime = (end[0] * 1000000000 + end[1]) / 1000000;
            console.log(`Search ${i + 1} took ${executionTime.toFixed(2)}ms (found ${result.length} results)`);
        }

        // Get query plans
        console.log('\nQuery plan WITHOUT index:');
        await dataSource.query('DROP INDEX IF EXISTS idx_users_username_trigram;');
        await dataSource.query('DROP INDEX IF EXISTS idx_users_username_btree;');
        const planWithout = await dataSource.query(`
            EXPLAIN ANALYZE
            SELECT * FROM users 
            WHERE username LIKE '%user_1%' 
            LIMIT 10;
        `);
        console.log(planWithout);

        console.log('\nQuery plan WITH index:');
        await dataSource.query('CREATE INDEX idx_users_username_trigram ON users USING gin (username gin_trgm_ops);');
        await dataSource.query('CREATE INDEX idx_users_username_btree ON users USING btree (username);');
        const planWith = await dataSource.query(`
            EXPLAIN ANALYZE
            SELECT * FROM users 
            WHERE username LIKE '%user_1%' 
            LIMIT 10;
        `);
        console.log(planWith);

    } catch (error) {
        console.error('Error during performance test:', error);
    } finally {
        await dataSource.destroy();
    }
}

testSearchPerformance();