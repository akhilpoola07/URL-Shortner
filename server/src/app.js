const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const cookieParser = require('cookie-parser');
require('dotenv').config();

const apiRoutes = require('./routes/index');
const redirectRoutes = require('./routes/redirect.routes');
const errorHandler = require('./middleware/error.middleware');
const { sendError } = require('./utils/responseHandler');

const app = express();

// Security HTTP headers
app.use(
    helmet({
        contentSecurityPolicy: false, // Disable CSP for API redirects/flexibility
    })
);

// CORS configuration
const allowedOrigins = [
    process.env.CLIENT_ORIGIN || 'http://localhost:5173',
    'http://localhost:3000',
    'http://127.0.0.1:5173'
];

app.use(
    cors({
        origin: function (origin, callback) {
            // Allow requests with no origin (like mobile apps, curl, or postman)
            if (!origin) return callback(null, true);
            if (allowedOrigins.indexOf(origin) !== -1 || process.env.NODE_ENV !== 'production') {
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

// Short URL Redirect Route (Catch-all for short codes e.g. /:shortCode)
app.use('/', redirectRoutes);

// 404 handler for undefined API routes
app.use('/api/*', (req, res) => {
    sendError(res, 404, 'API endpoint not found.');
});

// Global Error Handler
app.use(errorHandler);

module.exports = app;
