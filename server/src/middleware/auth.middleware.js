const jwt = require('jsonwebtoken');
const jwtConfig = require('../config/jwt');
const { sendError } = require('../utils/responseHandler');

/**
 * Middleware to require JWT authentication
 */
const authenticateToken = (req, res, next) => {
    let token = null;

    // 1. Check HTTP-only cookie
    if (req.cookies && req.cookies[jwtConfig.cookieName]) {
        token = req.cookies[jwtConfig.cookieName];
    }
    // 2. Check Authorization Bearer header as fallback
    else if (req.headers.authorization && req.headers.authorization.startsWith('Bearer ')) {
        token = req.headers.authorization.split(' ')[1];
    }

    if (!token) {
        return sendError(res, 401, 'Authentication required. Please log in.');
    }

    try {
        const decoded = jwt.verify(token, jwtConfig.secret);
        req.user = decoded;
        next();
    } catch (err) {
        if (err.name === 'TokenExpiredError') {
            return sendError(res, 401, 'Session expired. Please log in again.');
        }
        return sendError(res, 401, 'Invalid or corrupted authentication token.');
    }
};

/**
 * Optional authentication middleware - attaches req.user if valid token present
 */
const optionalToken = (req, res, next) => {
    let token = null;
    if (req.cookies && req.cookies[jwtConfig.cookieName]) {
        token = req.cookies[jwtConfig.cookieName];
    } else if (req.headers.authorization && req.headers.authorization.startsWith('Bearer ')) {
        token = req.headers.authorization.split(' ')[1];
    }

    if (token) {
        try {
            const decoded = jwt.verify(token, jwtConfig.secret);
            req.user = decoded;
        } catch (_) {
            req.user = null;
        }
    }
    next();
};

module.exports = {
    authenticateToken,
    optionalToken,
};
