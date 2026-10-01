const { Pool } = require('pg');
require('dotenv').config();

let pool;

if (process.env.NODE_ENV === 'test' && global.__TEST_PG_POOL__) {
    pool = global.__TEST_PG_POOL__;
} else {
    const connectionString = process.env.DATABASE_URL || 'postgresql://linkshort_user:linkshort_password@localhost:5432/linkshort_db';
    pool = new Pool({
        connectionString,
        max: 10,
        idleTimeoutMillis: 30000,
        connectionTimeoutMillis: 2000,
    });
}

// Log connection errors (test pool adapter has no .on method)
if (typeof pool.on === 'function') {
    pool.on('error', (err) => {
        console.error('Unexpected database pool error:', err);
    });
}

module.exports = {
    pool,
    query: (text, params) => {
        if (process.env.NODE_ENV === 'test' && global.__TEST_PG_POOL__) {
            return global.__TEST_PG_POOL__.query(text, params);
        }
        return pool.query(text, params);
    },
};
