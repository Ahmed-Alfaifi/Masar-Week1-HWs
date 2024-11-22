import { DataSource } from 'typeorm';
import dataSource from '../../ormconfig';

async function testPerformance() {
    try {
        await dataSource.initialize();
        console.log('Database connection initialized');

        // Drop existing index if any
        await dataSource.query('DROP INDEX IF EXISTS idx_users_username;');
        console.log('Dropped username index');

        // Test search performance without index
        console.log('\nTesting without index:');
        for (let i = 0; i < 5; i++) {
            const start = process.hrtime();
            
            await dataSource.query(`
                SELECT * FROM users 
                WHERE username LIKE $1 
                LIMIT 10
            `, ['%test%']);

            const end = process.hrtime(start);
            console.log(`Run ${i + 1}: ${end[0]}s ${end[1] / 1000000}ms`);
        }

        // Create index
        await dataSource.query('CREATE INDEX idx_users_username ON users USING btree (username);');
        console.log('\nCreated username index');

        // Test search performance with index
        console.log('\nTesting with index:');
        for (let i = 0; i < 5; i++) {
            const start = process.hrtime();
            
            await dataSource.query(`
                SELECT * FROM users 
                WHERE username LIKE $1 
                LIMIT 10
            `, ['%test%']);

            const end = process.hrtime(start);
            console.log(`Run ${i + 1}: ${end[0]}s ${end[1] / 1000000}ms`);
        }

        // Test query plans
        console.log('\nQuery plan without index:');
        await dataSource.query('DROP INDEX IF EXISTS idx_users_username;');
        const planWithoutIndex = await dataSource.query(`
            EXPLAIN ANALYZE
            SELECT * FROM users 
            WHERE username LIKE '%test%' 
            LIMIT 10
        `);
        console.log(planWithoutIndex);

        console.log('\nQuery plan with index:');
        await dataSource.query('CREATE INDEX idx_users_username ON users USING btree (username);');
        const planWithIndex = await dataSource.query(`
            EXPLAIN ANALYZE
            SELECT * FROM users 
            WHERE username LIKE '%test%' 
            LIMIT 10
        `);
        console.log(planWithIndex);

    } catch (error) {
        console.error('Error during performance test:', error);
    } finally {
        await dataSource.destroy();
    }
}

testPerformance();