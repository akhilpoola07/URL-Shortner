const { newDb, DataType } = require('pg-mem');

// Set test environment variables
process.env.NODE_ENV = 'test';
process.env.JWT_SECRET = 'test_jwt_secret_key_12345678901234567890';
process.env.APP_BASE_URL = 'http://localhost:5000';

const setupTestDatabase = () => {
    const dbMemory = newDb();

    // Register PostgreSQL functions used by schema/queries
    dbMemory.public.registerFunction({
        name: 'current_timestamp',
        returns: DataType.timestamp,
        implementation: () => new Date(),
    });

    dbMemory.public.registerFunction({
        name: 'to_char',
        args: [DataType.timestamp, DataType.text],
        returns: DataType.text,
        implementation: (date, _format) => {
            const d = new Date(date);
            return d.toISOString().split('T')[0];
        },
    });

    // Execute schema SQL
    dbMemory.public.none(`
        CREATE TABLE users (
            id SERIAL PRIMARY KEY,
            name VARCHAR(100) NOT NULL,
            email VARCHAR(255) UNIQUE NOT NULL,
            password_hash VARCHAR(255) NOT NULL,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        );

        CREATE TABLE urls (
            id SERIAL PRIMARY KEY,
            user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
            title VARCHAR(200),
            original_url TEXT NOT NULL,
            short_code VARCHAR(30) UNIQUE NOT NULL,
            clicks INTEGER DEFAULT 0,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        );

        CREATE TABLE click_events (
            id SERIAL PRIMARY KEY,
            url_id INTEGER NOT NULL REFERENCES urls(id) ON DELETE CASCADE,
            clicked_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        );
    `);

    // Use pg-mem's built-in pg adapter for a proper Pool with execution context
    const { Pool } = dbMemory.adapters.createPg();
    const pool = new Pool();

    global.__TEST_PG_POOL__ = pool;
    return pool;
};

module.exports = setupTestDatabase;
