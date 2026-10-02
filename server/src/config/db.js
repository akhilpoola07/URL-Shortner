const { Pool } = require('pg');
const path = require('path');
const fs = require('fs');
require('dotenv').config({ path: path.join(__dirname, '../../.env') });
require('dotenv').config();

let pool;

if (process.env.NODE_ENV === 'test' && global.__TEST_PG_POOL__) {
    pool = global.__TEST_PG_POOL__;
} else {
    const connectionString =
        process.env.DATABASE_URL ||
        'postgresql://linkshort_user:linkshort_password@localhost:5432/linkshort_db';

    const isLocalhost =
        connectionString.includes('localhost') || connectionString.includes('127.0.0.1');

    const useSsl =
        process.env.DATABASE_SSL === 'true' ||
        (process.env.NODE_ENV === 'production' && !isLocalhost);

    pool = new Pool({
        connectionString,
        ssl: useSsl ? { rejectUnauthorized: false } : false,
        max: 10,
        idleTimeoutMillis: 30000,
        connectionTimeoutMillis: 10000,
    });
}

// Log connection errors (test pool adapter has no .on method)
if (typeof pool.on === 'function') {
    pool.on('error', (err) => {
        console.error('Unexpected database pool error:', err);
    });
}

/**
 * Apply database/schema.sql so Railway (and fresh local DBs) get tables automatically.
 * Safe to re-run: schema uses IF NOT EXISTS.
 */
const ensureSchema = async () => {
    if (process.env.NODE_ENV === 'test') return;

    const schemaPath = path.join(__dirname, '../../../database/schema.sql');
    if (!fs.existsSync(schemaPath)) {
        console.warn('[Database] schema.sql not found — skipping auto-migration.');
        return;
    }

    const schemaSql = fs.readFileSync(schemaPath, 'utf8');
    await pool.query(schemaSql);
    console.log('[Database] Schema verified / applied successfully.');
};

module.exports = {
    pool,
    ensureSchema,
    query: (text, params) => {
        if (process.env.NODE_ENV === 'test' && global.__TEST_PG_POOL__) {
            return global.__TEST_PG_POOL__.query(text, params);
        }
        return pool.query(text, params);
    },
};
