const { sendError } = require('../utils/responseHandler');

/**
 * Global Error Handling Middleware
 */
const errorHandler = (err, req, res, next) => {
    console.error('Unhandled Error:', err);

    // Postgres unique constraint violation
    if (err.code === '23505') {
        return sendError(res, 409, 'A resource with this key already exists.');
    }

    // JSON parse error
    if (err instanceof SyntaxError && err.status === 400 && 'body' in err) {
        return sendError(res, 400, 'Invalid JSON payload format.');
    }

    const statusCode = err.statusCode || 500;
    const message = process.env.NODE_ENV === 'production' && statusCode === 500
        ? 'An internal server error occurred.'
        : err.message || 'Internal server error.';

    return sendError(res, statusCode, message);
};

module.exports = errorHandler;
