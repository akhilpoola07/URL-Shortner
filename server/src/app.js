const path = require('path');
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const cookieParser = require('cookie-parser');
require('dotenv').config({ path: path.join(__dirname, '../.env') });
require('dotenv').config();

const apiRoutes = require('./routes/index');
const redirectRoutes = require('./routes/redirect.routes');
const RedirectController = require('./controllers/redirect.controller');
const errorHandler = require('./middleware/error.middleware');
const { sendError } = require('./utils/responseHandler');
const { RESERVED_ALIASES } = require('./utils/urlValidator');

const app = express();
const isProduction = process.env.NODE_ENV === 'production';

// Security HTTP headers
app.use(
    helmet({
        contentSecurityPolicy: false, // Disable CSP for API redirects/flexibility
    })
);

// CORS configuration — same-origin in production (Express serves the React build)
const allowedOrigins = [
    process.env.CLIENT_ORIGIN,
    process.env.APP_BASE_URL,
    'http://localhost:5173',
    'http://localhost:3000',
    'http://127.0.0.1:5173',
].filter(Boolean);

app.use(
    cors({
        origin: function (origin, callback) {
            // Allow requests with no origin (mobile apps, curl, Postman, same-origin)
            if (!origin) return callback(null, true);
            if (
                allowedOrigins.includes(origin) ||
                !isProduction ||
                process.env.CLIENT_ORIGIN === '*'
            ) {
                return callback(null, true);
            }
            return callback(new Error('CORS policy error: Origin not allowed.'));
        },
        credentials: true,
        methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
        allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'Accept'],
    })
);

// Body parsing middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser(process.env.COOKIE_SECRET || 'cookie_secret_key'));

// API Routes
app.use('/api', apiRoutes);

// 404 handler for undefined API routes (must stay before SPA / redirect catch-alls)
app.use('/api', (req, res) => {
    sendError(res, 404, 'API endpoint not found.');
});

if (isProduction) {
    // Serve the Vite React production build from client/dist
    const clientDistPath = path.join(__dirname, '..', '..', 'client', 'dist');

    app.use(
        express.static(clientDistPath, {
            index: false,
            maxAge: '1y',
            setHeaders: (res, filePath) => {
                if (filePath.endsWith('.html')) {
                    res.setHeader('Cache-Control', 'no-cache');
                }
            },
        })
    );

    // Short URL redirects — skip reserved frontend routes and files with extensions
    app.get('/:shortCode', (req, res, next) => {
        const { shortCode } = req.params;

        if (
            RESERVED_ALIASES.has(shortCode.toLowerCase()) ||
            shortCode.includes('.')
        ) {
            return next();
        }

        return RedirectController.handleRedirect(req, res, next);
    });

    // React Router SPA fallback — serve index.html for frontend routes
    app.get('*', (req, res, next) => {
        if (req.method !== 'GET' && req.method !== 'HEAD') {
            return next();
        }

        return res.sendFile(path.join(clientDistPath, 'index.html'), (err) => {
            if (err) next(err);
        });
    });
} else {
    // Development: API-only server; React runs separately on Vite
    app.use('/', redirectRoutes);
}

// Global Error Handler
app.use(errorHandler);

module.exports = app;
