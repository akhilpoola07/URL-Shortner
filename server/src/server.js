const app = require('./app');
const { pool } = require('./config/db');

const PORT = process.env.PORT || 5000;

// Test DB connection before starting server
pool.query('SELECT NOW()')
    .then((res) => {
        console.log(`[Database] Connected successfully to PostgreSQL at ${res.rows[0].now}`);
        app.listen(PORT, () => {
            console.log(`[Server] LinkShort API server running on port ${PORT}`);
            console.log(`[Server] Environment: ${process.env.NODE_ENV || 'development'}`);
            console.log(`[Server] Base URL: ${process.env.APP_BASE_URL || `http://localhost:${PORT}`}`);
        });
    })
    .catch((err) => {
        console.error('[Database] Failed to connect to PostgreSQL:', err.message);
        console.warn('[Server] Starting server in fallback mode (Database connection warning)...');
        app.listen(PORT, () => {
            console.log(`[Server] LinkShort API server running on port ${PORT}`);
        });
    });
