require('dotenv').config();

module.exports = {
    secret: process.env.JWT_SECRET || 'fallback_development_secret_key_32chars!',
    expiresIn: process.env.JWT_EXPIRES_IN || '7d',
    cookieName: 'linkshort_token',
};
