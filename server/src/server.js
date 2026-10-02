const path = require('path');

// Load env from server/.env then project root .env (Railway injects vars directly)
require('dotenv').config({ path: path.join(__dirname, '../.env') });
require('dotenv').config({ path: path.join(__dirname, '../../.env') });

const app = require('./app');
const { pool, ensureSchema } = require('./config/db');
const { getBaseUrl } = require('./config/appUrl');

const PORT = process.env.PORT || 5000;

const startServer = async () => {
    try {
        await pool.query('SELECT NOW()');
        console.log('[Database] Connected successfully to PostgreSQL');

        await ensureSchema();

        app.listen(PORT, '0.0.0.0', () => {
            console.log(`[Server] LinkShort running on port ${PORT}`);
            console.log(`[Server] Environment: ${process.env.NODE_ENV || 'development'}`);
            console.log(`[Server] Base URL: ${getBaseUrl()}`);
        });
    } catch (err) {
        console.error('[Database] Failed to connect to PostgreSQL:', err.message);
        console.warn('[Server] Starting server in fallback mode (Database connection warning)...');

        app.listen(PORT, '0.0.0.0', () => {
            console.log(`[Server] LinkShort running on port ${PORT}`);
        });
    }
};

startServer();
