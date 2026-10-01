const rateLimit = require('express-rate-limit');
const { sendError } = require('../utils/responseHandler');

const authLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 20, // max 20 requests per IP
    handler: (req, res) => {
        sendError(res, 429, 'Too many authentication attempts. Please try again after 15 minutes.');
    },
    standardHeaders: true,
    legacyHeaders: false,
});

const urlCreationLimiter = rateLimit({
    windowMs: 60 * 1000, // 1 minute
    max: 30, // max 30 shortened URLs per minute
    handler: (req, res) => {
        sendError(res, 429, 'Rate limit exceeded for creating URLs. Please slow down.');
    },
    standardHeaders: true,
    legacyHeaders: false,
});

module.exports = {
    authLimiter,
    urlCreationLimiter,
};
